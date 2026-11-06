'use client';

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { UserProfile } from '@/types';
import { getUserProgress, saveUserProgress } from '@/lib/storage';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  onAuthStateChanged,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as updateFirebaseProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { useLocale } from '@/i18n/LocaleContext';
import { t } from '@/i18n/ui';

type AuthModalTab = 'login' | 'signup' | 'verify';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isFirebaseReady: boolean;
  isAuthModalOpen: boolean;
  authModalTab: AuthModalTab;
  openAuthModal: (tab?: AuthModalTab) => void;
  closeAuthModal: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string, name?: string, isSignUp?: boolean) => Promise<void>;
  confirmEmailVerification: () => Promise<boolean>;
  resendEmailVerification: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => void;
  logout: () => Promise<void>;
}

const AUTH_STORAGE_KEY = 'swiftlab_auth_user_v1';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toUserProfile(fbUser: FirebaseUser, previous: Partial<UserProfile> | null, locale: 'uk' | 'en'): UserProfile {
  const isGoogle = fbUser.providerData.some((provider) => provider.providerId === 'google.com');
  const isVerified = fbUser.emailVerified || isGoogle;
  const email = fbUser.email || '';

  return {
    id: fbUser.uid,
    name: fbUser.displayName || previous?.name || email.split('@')[0] || t('Розробник', locale),
    email,
    avatar: fbUser.photoURL || previous?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
    provider: isGoogle ? 'google' : 'email',
    isVerified,
    verifiedAt: isVerified ? previous?.verifiedAt || new Date().toISOString() : undefined,
    joinedAt: previous?.joinedAt || new Date().toISOString().split('T')[0],
    role: previous?.role || (locale === 'en' ? 'iOS course student' : 'Студент курсу iOS'),
    bio: previous?.bio || (locale === 'en'
      ? 'Beginner in Apple ecosystem mobile development.'
      : 'Початківець у світі мобільної розробки під екосистему Apple.'),
    goal: previous?.goal || 'own_app',
    githubUrl: previous?.githubUrl,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('login');

  const persistUser = (newUser: UserProfile | null) => {
    setUser(newUser);
    if (newUser) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    else localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event('swiftlab_auth_change'));
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch (error) {
      console.error('Failed to load user from localStorage', error);
    } finally {
      setIsLoading(false);
    }

    if (!isFirebaseConfigured) return;

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (!fbUser) {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) persistUser(null);
        return;
      }

      let previous: Partial<UserProfile> | null = null;
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) previous = JSON.parse(stored);
      } catch {}
      persistUser(toUserProfile(fbUser, previous, locale));
    });

    return () => unsubscribe();
  }, [locale]);

  const openAuthModal = (tab: AuthModalTab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const ensureFirebaseConfigured = () => {
    if (!isFirebaseConfigured) {
      throw new Error(
        t('Службу авторизації ще не налаштовано. Спробуйте пізніше або зверніться до підтримки.', locale)
      );
    }
  };

  const loginWithGoogle = async () => {
    ensureFirebaseConfigured();
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      persistUser(toUserProfile(result.user, user?.id === result.user.uid ? user : null, locale));
      if (getAdditionalUserInfo(result)?.isNewUser) {
        const progress = getUserProgress();
        progress.totalXp += 50;
        saveUserProgress(progress);
      }
      closeAuthModal();
    } catch (error) {
      const authError = error as { code?: string; message?: string };
      if (authError.code === 'auth/popup-closed-by-user') {
        throw new Error(t('Вікно входу Google було закрите до завершення авторизації.', locale));
      }
      if (authError.code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
        throw new Error(locale === 'en'
          ? `Domain "${domain}" is not authorized in Firebase Console. Add it under Authentication → Settings → Authorized domains.`
          : `Домен "${domain}" не авторизовано у Firebase Console! Додайте "${domain}" у Firebase ➔ Authentication ➔ Settings ➔ Authorized Domains.`);
      }
      if (authError.code === 'auth/cancelled-popup-request') {
        throw new Error(t('Попередній запит було скасовано.', locale));
      }
      throw new Error(authError.message || t('Помилка авторизації через Google.', locale));
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string, name?: string, isSignUp = false) => {
    ensureFirebaseConfigured();
    setIsLoading(true);
    try {
      const credential = isSignUp
        ? await createUserWithEmailAndPassword(auth, email.trim(), password)
        : await signInWithEmailAndPassword(auth, email.trim(), password);

      if (isSignUp) {
        await updateFirebaseProfile(credential.user, { displayName: name?.trim() || email.split('@')[0] });
        await sendEmailVerification(credential.user);
      }

      const account = toUserProfile(credential.user, user?.id === credential.user.uid ? user : null, locale);
      persistUser(account);

      if (isSignUp || !credential.user.emailVerified) {
        setAuthModalTab('verify');
      } else {
        closeAuthModal();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const confirmEmailVerification = async (): Promise<boolean> => {
    if (!auth.currentUser || !user || auth.currentUser.uid !== user.id) return false;
    await reload(auth.currentUser);
    if (!auth.currentUser.emailVerified) return false;

    const wasVerified = user.isVerified;
    const verifiedUser = toUserProfile(auth.currentUser, user, locale);
    persistUser(verifiedUser);
    if (!wasVerified) {
      const progress = getUserProgress();
      progress.totalXp += 50;
      saveUserProgress(progress);
    }
    closeAuthModal();
    return true;
  };

  const resendEmailVerification = async () => {
    if (!auth.currentUser || auth.currentUser.emailVerified) return;
    await sendEmailVerification(auth.currentUser);
  };

  const sendPasswordReset = async (email: string) => {
    ensureFirebaseConfigured();
    await sendPasswordResetEmail(auth, email.trim());
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    persistUser(updated);
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Firebase sign-out failed', error);
      }
    }
    persistUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isFirebaseReady: isFirebaseConfigured,
      isAuthModalOpen,
      authModalTab,
      openAuthModal,
      closeAuthModal,
      loginWithGoogle,
      loginWithEmail,
      confirmEmailVerification,
      resendEmailVerification,
      sendPasswordReset,
      updateProfile,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
