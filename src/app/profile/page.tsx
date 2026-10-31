'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getUserProgress, UserProgress } from '@/lib/storage';
import { LESSONS } from '@/data/lessons/index';
import { computeAchievements } from '@/data/achievements';
import {
  User,
  ShieldCheck,
  Award,
  BookOpen,
  Zap,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Edit3,
  Save,
  LogOut,
  AlertTriangle,
  FileCheck,
  Check,
  Lock,
  Github,
  Printer,
  Share2,
  Smartphone,
  Globe,
  Database,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

function ProfileContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'progress';

  const { user, openAuthModal, logout, updateProfile } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [activeTab, setActiveTab] = useState<'progress' | 'achievements' | 'certificate' | 'settings'>('progress');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editGoal, setEditGoal] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (initialTab === 'certificate' || initialTab === 'achievements' || initialTab === 'settings') {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    setProgress(getUserProgress());
    const handleStorage = () => setProgress(getUserProgress());
    window.addEventListener('storage', handleStorage);
    window.addEventListener('swiftlab_auth_change', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('swiftlab_auth_change', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditBio(user.bio || '');
      setEditGoal(user.goal || 'junior_job');
      setEditGithub(user.githubUrl || '');
    }
  }, [user]);

  // If user is not logged in, show sleek login gateway
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8 animate-fadeIn">
        <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-ios-blue/20 via-purple-500/20 to-pink-500/20 border border-white/10 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-ios-blue flex items-center justify-center text-white shadow-lg shadow-ios-blue/30">
            <User className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-3 max-w-xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Особистий Кабінет Студента
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Увійдіть за допомогою облікового запису Google або Email, щоб зберігати свій прогрес, відстежувати статистику навчання, проходити верифікацію та отримати іменний сертифікат розробника.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => openAuthModal('login')}
            className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-sm shadow-xl flex items-center justify-center gap-3 transition-transform hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span>Увійти через Google</span>
          </button>

          <button
            onClick={() => openAuthModal('signup')}
            className="w-full py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm border border-white/10 transition-colors"
          >
            Увійти з Email
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-6 text-left">
          <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h4 className="text-xs font-bold text-white">Верифікація облікового запису</h4>
            <p className="text-[11px] text-neutral-400">
              Підтверджена персональна сторінка розробника та підтверджений статус студента.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <h4 className="text-xs font-bold text-white">Офіційний Сертифікат</h4>
            <p className="text-[11px] text-neutral-400">
              Генерація іменного сертифіката з QR-кодом для додавання в резюме та LinkedIn.
            </p>
          </div>

          <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-2">
            <Zap className="w-5 h-5 text-ios-blue" />
            <h4 className="text-xs font-bold text-white">Хмарна синхронізація</h4>
            <p className="text-[11px] text-neutral-400">
              Ваші бали XP, стрік днів та прогрес уроків надійно зберігаються між пристроями.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calculations
  const completedIds = progress?.completedLessons || [];
  const totalLessons = LESSONS.length;
  const completedCount = completedIds.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);
  const totalXp = progress?.totalXp ?? 50;

  // Level computation
  let rankTitle = 'Junior iOS Початківець';
  let level = 1;
  let nextLevelXp = 150;
  if (totalXp >= 600) {
    rankTitle = 'Middle iOS Архітектор';
    level = 4;
    nextLevelXp = 1000;
  } else if (totalXp >= 350) {
    rankTitle = 'Junior+ iOS Розробник';
    level = 3;
    nextLevelXp = 600;
  } else if (totalXp >= 150) {
    rankTitle = 'SwiftUI Практик';
    level = 2;
    nextLevelXp = 350;
  }

  const levelProgressPercent = Math.min(100, Math.round((totalXp / nextLevelXp) * 100));
  const achievements = computeAchievements(progress || { completedLessons: [], quizScores: {}, totalXp: 50, streakDays: 1, lastActiveDate: '', bookmarks: [], currentModule: 1 }, user.isVerified);
  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      bio: editBio,
      goal: editGoal,
      githubUrl: editGithub,
    });
    setIsEditing(false);
  };

  const handleCopyCertificateLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/profile?tab=certificate');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrintCertificate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Profile Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-ios-blue/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar & User Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative group">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
                alt={user.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-white/20 shadow-xl"
              />
              {user.isVerified && (
                <div
                  className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-500 text-white shadow-lg border-2 border-[#121622]"
                  title="Верифікований акаунт"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {user.name}
                </h1>

                {user.isVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>
                      {user.provider === 'google' ? 'Google Верифікація' : 'Email Верифіковано'}
                    </span>
                  </span>
                ) : (
                  <button
                    onClick={() => openAuthModal('verify')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-all text-xs font-semibold animate-pulse"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Пройти верифікацію (+50 XP)</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                <span>{user.email}</span>
                <span>•</span>
                <span className="text-ios-blue font-semibold">{rankTitle}</span>
                <span>•</span>
                <span>На платформі з {user.joinedAt}</span>
              </div>

              {user.bio && (
                <p className="text-xs text-neutral-300 max-w-xl pt-1 leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 hover:text-white text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Скасувати' : 'Редагувати'}</span>
            </button>

            <button
              onClick={logout}
              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors"
              title="Вийти з акаунту"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn"
          >
            <div className="space-y-1">
              <label className="text-xs text-neutral-400">Імʼя та прізвище</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-ios-blue"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-400">GitHub профіль</label>
              <input
                type="url"
                value={editGithub}
                onChange={(e) => setEditGithub(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-ios-blue"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs text-neutral-400">Про себе / Біографія</label>
              <textarea
                rows={2}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-ios-blue"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-ios-blue hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-2 shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Зберегти зміни</span>
              </button>
            </div>
          </form>
        )}

        {/* Verification Status Banner if Unverified */}
        {!user.isVerified && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-300">
                  Акаунт не верифіковано!
                </p>
                <p className="text-[11px] text-neutral-300">
                  Пройдіть швидку верифікацію (введіть 6-значний код підтвердження), щоб отримати право на офіційний сертифікат та бонусні +50 XP.
                </p>
              </div>
            </div>

            <button
              onClick={() => openAuthModal('verify')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs whitespace-nowrap shadow-lg transition-transform hover:scale-105"
            >
              Підтвердити зараз
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total XP & Level */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Рівень розробника</span>
            <div className="p-2 rounded-xl bg-yellow-500/10 text-yellow-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{level}</span>
              <span className="text-xs font-semibold text-yellow-400">({totalXp} XP)</span>
            </div>
            <div className="mt-2 w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-yellow-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">
              До рівня {level + 1}: {nextLevelXp - totalXp > 0 ? nextLevelXp - totalXp : 0} XP
            </p>
          </div>
        </div>

        {/* Lessons Completed */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Пройдено уроків</span>
            <div className="p-2 rounded-xl bg-ios-blue/10 text-ios-blue">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">
                {completedCount}/{totalLessons}
              </span>
              <span className="text-xs text-neutral-400">({progressPercent}%)</span>
            </div>
            <div className="mt-2 w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-ios-blue h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">7 модулів програми</p>
          </div>
        </div>

        {/* Streak */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Стрік навчання</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">
                {progress?.streakDays ?? 1}
              </span>
              <span className="text-xs font-semibold text-orange-400">дні(в) поспіль</span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-3">
              Підтримуйте щоденний ритм для кращого засвоєння
            </p>
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">Досягнення</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">
                {unlockedAchievementsCount}/{achievements.length}
              </span>
              <span className="text-xs font-semibold text-purple-400">відкрито</span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-3">
              Бейджі за практичні навички та квізи
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-white/10 flex items-center gap-2 sm:gap-6 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'progress'
              ? 'border-ios-blue text-ios-blue'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Мій прогрес ({progressPercent}%)</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'achievements'
              ? 'border-ios-blue text-ios-blue'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Досягнення ({unlockedAchievementsCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('certificate')}
          className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'certificate'
              ? 'border-ios-blue text-ios-blue'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Офіційний Сертифікат</span>
        </button>
      </div>

      {/* TAB 1: PROGRESS */}
      {activeTab === 'progress' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Список тем та статус завершення
            </h2>
            <Link
              href="/roadmap"
              className="text-xs font-semibold text-ios-blue hover:underline flex items-center gap-1"
            >
              <span>Відкрити повну дорожню карту</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LESSONS.map((lesson) => {
              const isDone = completedIds.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    isDone
                      ? 'bg-emerald-950/15 border-emerald-500/30'
                      : 'bg-neutral-900/60 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isDone
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </div>

                    <div>
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                        {lesson.moduleTitle}
                      </span>
                      <h4 className="text-xs font-bold text-white leading-tight mt-0.5">
                        {lesson.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                        {lesson.description}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/lessons/${lesson.id}`}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                      isDone
                        ? 'bg-white/5 hover:bg-white/10 text-neutral-300'
                        : 'bg-ios-blue hover:bg-blue-600 text-white shadow'
                    }`}
                  >
                    {isDone ? 'Повторити' : 'Вчити'}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ACHIEVEMENTS */}
      {activeTab === 'achievements' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="max-w-2xl space-y-1">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Ваші нагороди та досягнення
            </h2>
            <p className="text-xs text-neutral-400">
              Виконуйте завдання, проходьте уроки та тестуйте знання на симуляторі для розблокування унікальних бейджів розробника.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ach) => {
              return (
                <div
                  key={ach.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    ach.unlocked
                      ? 'bg-gradient-to-b from-neutral-900 to-[#121622] border-white/20 shadow-xl'
                      : 'bg-neutral-950/60 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg ${
                        ach.unlocked
                          ? 'bg-gradient-to-tr from-ios-blue to-purple-600 text-white shadow-ios-blue/20'
                          : 'bg-neutral-800 text-neutral-600'
                      }`}
                    >
                      {ach.id === 'verified_account' && <ShieldCheck className="w-6 h-6" />}
                      {ach.id === 'first_lesson' && <Sparkles className="w-6 h-6" />}
                      {ach.id === 'swiftui_master' && <Smartphone className="w-6 h-6" />}
                      {ach.id === 'state_ninja' && <Zap className="w-6 h-6" />}
                      {ach.id === 'network_concurrency' && <Globe className="w-6 h-6" />}
                      {ach.id === 'quiz_hero' && <Award className="w-6 h-6" />}
                      {ach.id === 'persistence_guru' && <Database className="w-6 h-6" />}
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ach.unlocked
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      {ach.unlocked ? '✓ Розблоковано' : 'Заблоковано'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">{ach.title}</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-yellow-400 font-semibold">+{ach.xpReward} XP</span>
                    {ach.unlocked && (
                      <span className="text-neutral-500">
                        {new Date().toLocaleDateString('uk-UA')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: CERTIFICATE */}
      {activeTab === 'certificate' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Іменний сертифікат проходження
              </h2>
              <p className="text-xs text-neutral-400">
                Офіційний сертифікат SwiftLab засвідчує опанування технологічного стеку iOS (Swift 6, SwiftUI, Concurrency, SwiftData).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCertificateLink}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-xs font-semibold text-neutral-200 transition-colors flex items-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Скопійовано!' : 'Поділитися'}</span>
              </button>

              <button
                onClick={handlePrintCertificate}
                className="px-4 py-2 rounded-xl bg-ios-blue hover:bg-blue-600 text-white text-xs font-semibold shadow-lg shadow-ios-blue/20 transition-all flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Друк / Зберегти PDF</span>
              </button>
            </div>
          </div>

          {/* Certificate Container with Apple Pro Luxury Styling */}
          <div className="relative max-w-4xl mx-auto p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#141824] via-[#0d101a] to-[#090b12] border-2 border-yellow-500/30 shadow-2xl shadow-yellow-500/5 text-center space-y-8 overflow-hidden print:p-8 print:bg-white print:text-black print:border-black">
            {/* Elegant corner ribbons */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-yellow-500/40 rounded-tl-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-yellow-500/40 rounded-tr-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-yellow-500/40 rounded-bl-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-yellow-500/40 rounded-br-3xl pointer-events-none" />

            {/* Certificate Header */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Official SwiftLab Academy Certification</span>
              </div>
              <h3 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 tracking-tight">
                СЕРТИФІКАТ РОЗРОБНИКА
              </h3>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                iOS Application Development (Swift 6 & SwiftUI)
              </p>
            </div>

            {/* Recipient */}
            <div className="space-y-2 py-4">
              <p className="text-xs text-neutral-400">Цим засвідчується, що</p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide border-b border-white/20 pb-2 inline-block px-8">
                {user.name}
              </h2>
              <p className="text-xs text-neutral-300 max-w-lg mx-auto pt-2 leading-relaxed">
                успішно пройшов програму підготовки розробника iOS додатків під iPhone та опанував роботу з сучасною мовою Swift 6, побудову UI на базі SwiftUI, асинхронні запити URLSession та сховище даних SwiftData.
              </p>
            </div>

            {/* Badges / Competencies */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {['Swift 6', 'SwiftUI', 'async / await', 'SwiftData', 'MVVM Pattern', 'Auto Layout'].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-neutral-300 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Footer Signatures & Stamp */}
            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-neutral-400">
              <div className="text-left space-y-1">
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">ID Сертифіката</p>
                <p className="font-mono text-white text-xs">
                  SL-{user.id.slice(-6).toUpperCase()}-2025
                </p>
              </div>

              {/* Official Gold Seal */}
              <div className="w-20 h-20 rounded-full border-2 border-yellow-500/60 bg-gradient-to-tr from-yellow-600/20 to-amber-400/20 flex flex-col items-center justify-center shadow-lg shadow-yellow-500/10">
                <ShieldCheck className="w-6 h-6 text-yellow-400 mb-0.5" />
                <span className="text-[8px] font-black uppercase tracking-widest text-yellow-300">
                  VERIFIED
                </span>
              </div>

              <div className="text-right space-y-1">
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider">Дата верифікації</p>
                <p className="text-white text-xs">
                  {user.verifiedAt
                    ? new Date(user.verifiedAt).toLocaleDateString('uk-UA')
                    : new Date().toLocaleDateString('uk-UA')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex items-center gap-3 text-neutral-400 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-ios-blue" />
            <span>Завантаження особистого кабінету...</span>
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}

