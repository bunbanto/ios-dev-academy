'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  Mail,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    loginWithGoogle,
    loginWithEmail,
    verifyEmail,
    resendVerificationCode,
    lastGeneratedCode,
    user,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'verify'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (authModalTab) {
      setMode(authModalTab);
    }
  }, [authModalTab, isAuthModalOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  if (!isAuthModalOpen) return null;

  const handleGoogleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (e: any) {
      setError(e.message || 'Не вдалося увійти через Google. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Введіть коректну електронну адресу');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await loginWithEmail(email, name || undefined);
      setResendCooldown(30);
    } catch (e: any) {
      setError(e.message || 'Помилка при відправці запиту. Спробуйте пізніше.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setError('Введіть код підтвердження');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const success = await verifyEmail(otpCode);
      if (!success) {
        setError('Невірний код верифікації. Перевірте код або надішліть новий.');
      }
    } catch (e) {
      setError('Помилка підтвердження. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    await resendVerificationCode();
    setResendCooldown(30);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#121622] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-ios-blue/10 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-ios-blue/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          aria-label="Закрити"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-ios-blue to-purple-600 shadow-lg shadow-ios-blue/25 text-white mb-1">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {mode === 'verify'
              ? 'Верифікація акаунту'
              : mode === 'signup'
              ? 'Реєстрація у SwiftLab'
              : 'Вхід в особистий кабінет'}
          </h2>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            {mode === 'verify'
              ? 'Підтвердіть вашу електронну адресу для отримання офіційного сертифіката'
              : 'Зберігайте прогрес у хмарі, відкривайте бейджі та отримуйте сертифікати Apple розробника'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* VERIFY MODE */}
        {mode === 'verify' ? (
          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div className="p-4 rounded-2xl bg-neutral-900/80 border border-white/5 space-y-2 text-center">
              <span className="text-xs text-neutral-400">Код надіслано на:</span>
              <p className="text-sm font-semibold text-ios-blue">{user?.email || email}</p>
              
              {/* Dev hint showing the code for convenience */}
              {(lastGeneratedCode || user?.verificationCode) && (
                <div className="mt-2 py-1.5 px-3 rounded-lg bg-ios-blue/10 border border-ios-blue/20 text-[11px] text-ios-blue flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    Тестовий код: <strong>{lastGeneratedCode || user?.verificationCode}</strong> (або 123456)
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-300">
                Введіть 6-значний код підтвердження:
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 bg-neutral-900 border border-white/10 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:border-ios-blue transition-colors"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otpCode.length < 4}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-ios-blue to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-ios-blue/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Перевірка...' : 'Підтвердити та верифікувати'}
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-neutral-400 hover:text-white"
              >
                Змінити email
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-ios-blue hover:underline disabled:text-neutral-500 disabled:no-underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                <span>
                  {resendCooldown > 0 ? `Надіслати знову (${resendCooldown}с)` : 'Надіслати код повторно'}
                </span>
              </button>
            </div>
          </form>
        ) : (
          /* LOGIN / SIGNUP MODE */
          <div className="space-y-5">
            {/* Google Sign-in Button */}
            <button
              onClick={handleGoogleSubmit}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-sm flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-60"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isSubmitting ? 'Зʼєднання з Google...' : 'Увійти через Google'}</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">
                або через Email
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs text-neutral-300 font-medium">Ваше імʼя</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Наприклад: Дмитро Мельник"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-ios-blue transition-colors"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-neutral-300 font-medium">Електронна пошта</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-ios-blue transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-ios-blue hover:bg-blue-600 text-white font-semibold text-xs shadow-lg shadow-ios-blue/20 transition-all flex items-center justify-center gap-2"
              >
                <span>
                  {mode === 'signup' ? 'Створити акаунт та отримати код' : 'Увійти з кодом перевірки'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Switch Mode */}
            <div className="text-center pt-2">
              {mode === 'login' ? (
                <p className="text-xs text-neutral-400">
                  Ще не маєте профілю?{' '}
                  <button
                    onClick={() => {
                      setMode('signup');
                      setError(null);
                    }}
                    className="text-ios-blue font-semibold hover:underline"
                  >
                    Зареєструватися
                  </button>
                </p>
              ) : (
                <p className="text-xs text-neutral-400">
                  Вже маєте акаунт?{' '}
                  <button
                    onClick={() => {
                      setMode('login');
                      setError(null);
                    }}
                    className="text-ios-blue font-semibold hover:underline"
                  >
                    Увійти
                  </button>
                </p>
              )}
            </div>

            {/* Feature perks badge */}
            <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px] text-neutral-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Іменний сертифікат</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Збереження в хмарі</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
