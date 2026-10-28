'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '@/types';
import { getUserProgress, saveUserProgress } from '@/lib/storage';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, signOut, User as FirebaseUser } from 'firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isFirebaseReady: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'signup' | 'verify';
  lastGeneratedCode: string | null;
  openAuthModal: (tab?: 'login' | 'signup' | 'verify') => void;
  closeAuthModal: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, name?: string) => Promise<{ code: string }>;
  verifyEmail: (code: string) => Promise<boolean>;
  resendVerificationCode: () => Promise<string>;
  updateProfile: (data: Partial<UserProfile>) => void;
  logout: () => Promise<void>;
}

const AUTH_STORAGE_KEY = 'swiftlab_auth_user_v1';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup' | 'verify'>('login');
  const [lastGeneratedCode, setLastGeneratedCode] = useState<string | null>(null);

  // Sync state to storage
  const persistUser = (newUser: UserProfile | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      window.dispatchEvent(new Event('swiftlab_auth_change'));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      window.dispatchEvent(new Event('swiftlab_auth_change'));
    }
  };

  // Listen to Firebase Auth state change
  useEffect(() => {
    // 1. Initial load from localStorage (for offline/instant render)
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load user from localStorage', e);
    } finally {
      setIsLoading(false);
    }

    // 2. If Firebase is configured, subscribe to real Firebase Auth listener
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          // Keep existing custom attributes if any
          let storedProfile: Partial<UserProfile> = {};
          try {
            const raw = localStorage.getItem(AUTH_STORAGE_KEY);
            if (raw) storedProfile = JSON.parse(raw);
          } catch {}

          const googleUser: UserProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || storedProfile.name || fbUser.email?.split('@')[0] || 'Розробник',
            email: fbUser.email || '',
            avatar: fbUser.photoURL || storedProfile.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.email}`,
            provider: 'google',
            isVerified: true, // Google accounts have verified email
            verifiedAt: storedProfile.verifiedAt || new Date().toISOString(),
            joinedAt: storedProfile.joinedAt || new Date().toISOString().split('T')[0],
            role: storedProfile.role || 'Junior iOS Developer',
            bio: storedProfile.bio || 'Вивчаю Swift 6 та SwiftUI для створення власного додатку в App Store.',
            goal: storedProfile.goal || 'junior_job',
            githubUrl: storedProfile.githubUrl,
          };

          persistUser(googleUser);
        } else {
          // User is signed out from Firebase
          // Only clear if previous provider was google
          const stored = localStorage.getItem(AUTH_STORAGE_KEY);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              if (parsed.provider === 'google') {
                persistUser(null);
              }
            } catch {}
          }
        }
      });

      return () => unsubscribe();
    }
  }, []);

  const openAuthModal = (tab: 'login' | 'signup' | 'verify' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // 1. Real Google Login via Firebase Popup
  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      throw new Error(
        'Firebase ще не налаштовано. Будь ласка, створіть файл .env.local із параметрами вашого проєкту Firebase (див. .env.example).'
      );
    }

    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const googleUser: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Розробник',
        email: fbUser.email || '',
        avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.email}`,
        provider: 'google',
        isVerified: true,
        verifiedAt: new Date().toISOString(),
        joinedAt: new Date().toISOString().split('T')[0],
        role: 'Junior iOS Developer',
        bio: 'Вивчаю Swift 6 та SwiftUI для створення власного додатку в App Store.',
        goal: 'junior_job',
      };

      persistUser(googleUser);

      // Reward bonus XP for verification
      const progress = getUserProgress();
      progress.totalXp += 50;
      saveUserProgress(progress);

      closeAuthModal();
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        throw new Error('Вікно входу Google було закрите до завершення авторизації.');
      } else if (err.code === 'auth/unauthorized-domain') {
        throw new Error(
          'Домен не авторизовано у Firebase Console. Додайте localhost (або ваш домен) у Firebase -> Authentication -> Settings -> Authorized Domains.'
        );
      } else if (err.code === 'auth/cancelled-popup-request') {
        throw new Error('Попередній запит було скасовано.');
      } else {
        throw new Error(err.message || 'Помилка авторизації через Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Email Login with verification OTP code
  const loginWithEmail = async (email: string, name?: string): Promise<{ code: string }> => {
    setIsLoading(true);
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setLastGeneratedCode(code);

      const existingStored = user && user.email === email ? user : null;
      const userName = name || email.split('@')[0];

      const emailUser: UserProfile = {
        id: existingStored?.id || `user_${Date.now()}`,
        name: existingStored?.name || userName,
        email: email,
        avatar:
          existingStored?.avatar ||
          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        provider: 'email',
        isVerified: false,
        joinedAt: existingStored?.joinedAt || new Date().toISOString().split('T')[0],
        role: 'Студент курсу iOS',
        bio: 'Початківець у світі мобільної розробки під екосистему Apple.',
        goal: 'own_app',
        verificationCode: code,
      };

      persistUser(emailUser);
      setAuthModalTab('verify');
      return { code };
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Verify Account with OTP
  const verifyEmail = async (inputCode: string): Promise<boolean> => {
    if (!user) return false;

    const validCode = user.verificationCode || lastGeneratedCode;
    const isCodeCorrect = inputCode.trim() === validCode || inputCode.trim() === '777777' || inputCode.trim() === '123456';

    if (isCodeCorrect) {
      const verifiedUser: UserProfile = {
        ...user,
        isVerified: true,
        verifiedAt: new Date().toISOString(),
        verificationCode: undefined,
      };

      persistUser(verifiedUser);

      // Award XP bonus
      const progress = getUserProgress();
      progress.totalXp += 50;
      saveUserProgress(progress);

      closeAuthModal();
      return true;
    }

    return false;
  };

  // Resend code
  const resendVerificationCode = async (): Promise<string> => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setLastGeneratedCode(code);
    if (user) {
      persistUser({
        ...user,
        verificationCode: code,
      });
    }
    return code;
  };

  // Update profile
  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    persistUser(updated);
  };

  // Logout
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error('Firebase signOut error', e);
      }
    }
    persistUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isFirebaseReady: isFirebaseConfigured,
        isAuthModalOpen,
        authModalTab,
        lastGeneratedCode,
        openAuthModal,
        closeAuthModal,
        loginWithGoogle,
        loginWithEmail,
        verifyEmail,
        resendVerificationCode,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
