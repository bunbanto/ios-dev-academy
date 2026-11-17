'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Users,
  LockKeyhole,
  Unlock,
  Search,
  UserPlus,
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
  BookOpen,
  Sparkles,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/i18n/LocaleContext';
import { localizeContent } from '@/i18n/content';
import { LESSONS } from '@/data/lessons/index';
import {
  ADMIN_EMAIL,
  getAllManagedUsers,
  getRoleLabel,
  isAdminUser,
  normalizeEmail,
  resetAllLessonsProgressForUser,
  resetAllUsersLessonsProgress,
  resetSingleLessonProgressForUser,
  resetUserAccessOverrides,
  setAllLessonsAccessForUser,
  setLessonAccessForUser,
  setModuleAccessForUser,
  upsertManagedStudentByEmail,
} from '@/lib/access';
import { isBaseModuleUnlocked, isLessonUnlocked } from '@/lib/progression';
import type { ManagedUserRecord } from '@/types';

export default function AdminPage() {
  const { locale } = useLocale();
  const { user, isAdmin, isFirebaseReady, openAuthModal, refreshAccessControl } = useAuth();
  const localizedLessons = useMemo(() => localizeContent(LESSONS, locale), [locale]);

  const [users, setUsers] = useState<ManagedUserRecord[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string>('');
  const [userSearch, setUserSearch] = useState('');
  const [lessonSearch, setLessonSearch] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmResetAllOpen, setConfirmResetAllOpen] = useState(false);
  const [resetAllIncludeAdmins, setResetAllIncludeAdmins] = useState(true);
  const [confirmResetSelectedUser, setConfirmResetSelectedUser] = useState(false);

  const loadUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    setErrorMessage(null);
    try {
      const list = await getAllManagedUsers();
      setUsers(list);
      setSelectedEmail((prev) => {
        if (prev && list.some((u) => u.email === prev)) return prev;
        const firstStudent = list.find((u) => u.role === 'student');
        return firstStudent?.email || list[0]?.email || '';
      });
    } catch (error: any) {
      console.error('Failed to load managed users', error);
      setUsers([]);
      setSelectedEmail('');
      setErrorMessage(
        error?.message ||
          (locale === 'en'
            ? 'Could not load users from Firestore. Check your connection and Firestore security rules.'
            : 'Не вдалося завантажити список користувачів із Firestore. Перевірте інтернет-з’єднання та деплой правил безпеки.'),
      );
    } finally {
      setIsLoadingUsers(false);
    }
  }, [locale]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers, user?.email]);

  const selectedUser = useMemo(
    () => users.find((u) => u.email === selectedEmail) || null,
    [users, selectedEmail],
  );

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.name.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    );
  }, [users, userSearch]);

  const modulesList = useMemo(() => {
    const map = new Map<number, { moduleNumber: number; moduleTitle: string; lessons: typeof localizedLessons }>();
    localizedLessons.forEach((lesson) => {
      const q = lessonSearch.trim().toLowerCase();
      if (
        q &&
        !lesson.title.toLowerCase().includes(q) &&
        !lesson.moduleTitle.toLowerCase().includes(q) &&
        !lesson.id.toLowerCase().includes(q)
      ) {
        return;
      }
      if (!map.has(lesson.module)) {
        map.set(lesson.module, {
          moduleNumber: lesson.module,
          moduleTitle: lesson.moduleTitle,
          lessons: [],
        });
      }
      map.get(lesson.module)!.lessons.push(lesson);
    });
    return Array.from(map.values()).sort((a, b) => a.moduleNumber - b.moduleNumber);
  }, [localizedLessons, lessonSearch]);

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => {
      setStatusMessage((current) => (current === msg ? null : current));
    }, 3000);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);
    const email = normalizeEmail(newStudentEmail);
    if (!email || !email.includes('@')) {
      setErrorMessage(
        locale === 'en' ? 'Enter a valid student email address.' : 'Введіть коректний email користувача.',
      );
      return;
    }

    setIsSaving(true);
    try {
      const added = await upsertManagedStudentByEmail(email, newStudentName);
      await loadUsers();
      setSelectedEmail(added.email);
      setNewStudentEmail('');
      setNewStudentName('');
      showToast(
        locale === 'en'
          ? `User ${added.email} added to list.`
          : `Користувача ${added.email} додано до списку.`,
      );
    } catch (error: any) {
      setErrorMessage(error?.message || 'Error adding student');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleLesson = async (lessonId: string, currentlyUnlocked: boolean) => {
    if (!selectedUser || isAdminUser(selectedUser)) return;
    setIsSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const nextGrant = !currentlyUnlocked;
      const updatedAccess = await setLessonAccessForUser(
        { email: selectedUser.email, uid: selectedUser.uid, name: selectedUser.name },
        lessonId,
        nextGrant,
        LESSONS,
        selectedUser.completedLessons,
        user?.email || ADMIN_EMAIL,
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.email === selectedUser.email
            ? {
                ...u,
                unlockedLessons: updatedAccess.unlockedLessons,
                lockedLessons: updatedAccess.lockedLessons,
              }
            : u,
        ),
      );
      await refreshAccessControl();
      showToast(
        nextGrant
          ? locale === 'en'
            ? `Task opened for ${selectedUser.email}`
            : `Доступ до завдання відкрито для ${selectedUser.email}`
          : locale === 'en'
          ? `Task closed for ${selectedUser.email}`
          : `Доступ до завдання закрито для ${selectedUser.email}`,
      );
    } catch (error: any) {
      setErrorMessage(error?.message || 'Could not update lesson access');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleModule = async (moduleNumber: number, grantAccess: boolean) => {
    if (!selectedUser || isAdminUser(selectedUser)) return;
    setIsSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const updatedAccess = await setModuleAccessForUser(
        { email: selectedUser.email, uid: selectedUser.uid, name: selectedUser.name },
        moduleNumber,
        grantAccess,
        LESSONS,
        user?.email || ADMIN_EMAIL,
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.email === selectedUser.email
            ? {
                ...u,
                unlockedLessons: updatedAccess.unlockedLessons,
                lockedLessons: updatedAccess.lockedLessons,
              }
            : u,
        ),
      );
      await refreshAccessControl();
      showToast(
        grantAccess
          ? locale === 'en'
            ? `Module ${moduleNumber} opened for ${selectedUser.email}`
            : `Модуль ${moduleNumber} повністю відкрито для ${selectedUser.email}`
          : locale === 'en'
          ? `Module ${moduleNumber} closed for ${selectedUser.email}`
          : `Модуль ${moduleNumber} закрито для ${selectedUser.email}`,
      );
    } catch (error: any) {
      setErrorMessage(error?.message || 'Could not update module access');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetAllAccess = async (grantAccess: boolean) => {
    if (!selectedUser || isAdminUser(selectedUser)) return;
    setIsSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const updatedAccess = await setAllLessonsAccessForUser(
        { email: selectedUser.email, uid: selectedUser.uid, name: selectedUser.name },
        grantAccess,
        LESSONS,
        user?.email || ADMIN_EMAIL,
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.email === selectedUser.email
            ? {
                ...u,
                unlockedLessons: updatedAccess.unlockedLessons,
                lockedLessons: updatedAccess.lockedLessons,
              }
            : u,
        ),
      );
      await refreshAccessControl();
      showToast(
        grantAccess
          ? locale === 'en'
            ? `All tasks opened for ${selectedUser.email}`
            : `Усі завдання відкрито для ${selectedUser.email}`
          : locale === 'en'
          ? `All tasks closed for ${selectedUser.email}`
          : `Усі завдання закрито для ${selectedUser.email}`,
      );
    } catch (error: any) {
      setErrorMessage(error?.message || 'Could not update access');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetOverrides = async () => {
    if (!selectedUser || isAdminUser(selectedUser)) return;
    setIsSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const updatedAccess = await resetUserAccessOverrides(
        { email: selectedUser.email, uid: selectedUser.uid, name: selectedUser.name },
        user?.email || ADMIN_EMAIL,
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.email === selectedUser.email
            ? {
                ...u,
                unlockedLessons: updatedAccess.unlockedLessons,
                lockedLessons: updatedAccess.lockedLessons,
              }
            : u,
        ),
      );
      await refreshAccessControl();
      showToast(
        locale === 'en'
          ? `Reset ${selectedUser.email} to standard progression.`
          : `Доступ для ${selectedUser.email} скинуто до стандартного прогресу.`,
      );
    } catch (error: any) {
      setErrorMessage(error?.message || 'Could not reset access');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSingleLessonProgress = async (lessonId: string) => {
    if (!selectedUser) return;
    setIsSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const updatedUser = await resetSingleLessonProgressForUser(selectedUser, lessonId);
      setUsers((prev) =>
        prev.map((u) => (u.email === selectedUser.email ? updatedUser : u)),
      );
      showToast(
        locale === 'en'
          ? `Lesson "${lessonId}" progress reset for ${selectedUser.email}.`
          : `Проходження уроку «${lessonId}» скинуто для ${selectedUser.email}.`,
      );
    } catch (error: any) {
      setErrorMessage(error?.message || 'Could not reset lesson progress');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSelectedUserProgress = async () => {
    if (!selectedUser) return;
    setIsSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const updatedUser = await resetAllLessonsProgressForUser(selectedUser);
      setUsers((prev) =>
        prev.map((u) => (u.email === selectedUser.email ? updatedUser : u)),
      );
      setConfirmResetSelectedUser(false);
      showToast(
        locale === 'en'
          ? `All completed lessons reset for ${selectedUser.email}.`
          : `Усі пройдені уроки та AI-челенджі скинуто для ${selectedUser.email}.`,
      );
    } catch (error: any) {
      setErrorMessage(error?.message || 'Could not reset user progress');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetAllUsersProgress = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);
    try {
      const { resetCount, updatedUsers } = await resetAllUsersLessonsProgress(users, {
        includeAdmins: resetAllIncludeAdmins,
      });
      setUsers(updatedUsers);
      setConfirmResetAllOpen(false);
      showToast(
        locale === 'en'
          ? `Reset completed lessons for ${resetCount} user(s).`
          : `Скинуто проходження уроків для ${resetCount} користувачів.`,
      );
    } catch (error: any) {
      setErrorMessage(error?.message || 'Could not reset progress for all users');
    } finally {
      setIsSaving(false);
    }
  };

  // Not logged in
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white">
            {locale === 'en' ? 'Administrator Panel' : 'Панель Адміністратора'}
          </h1>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            {locale === 'en'
              ? `Sign in with the administrator account (${ADMIN_EMAIL}) to manage student roles and task access.`
              : `Увійдіть через обліковий запис адміністратора (${ADMIN_EMAIL}), щоб керувати користувачами та відкривати/закривати доступ до завдань.`}
          </p>
        </div>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 rounded-2xl bg-ios-blue hover:bg-blue-600 text-white text-xs font-bold shadow-lg shadow-ios-blue/25 transition-all"
        >
          {locale === 'en' ? 'Sign In' : 'Увійти в акаунт'}
        </button>
      </div>
    );
  }

  // Logged in as Student (not Admin)
  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
          <LockKeyhole className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300">
            <span>{locale === 'en' ? 'Your role:' : 'Ваша роль:'}</span>
            <strong className="text-ios-blue">{getRoleLabel(user.role, locale)}</strong>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {locale === 'en' ? 'Administrator Access Only' : 'Доступ лише для Адміністратора'}
          </h1>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            {locale === 'en'
              ? `Your account (${user.email}) is classified as Student. Only the administrator (${ADMIN_EMAIL}) can manage task access for users.`
              : `Ваш акаунт (${user.email}) має роль «Студент». Відкривати та закривати доступ до завдань для користувачів може лише адміністратор (${ADMIN_EMAIL}).`}
          </p>
        </div>
        <Link
          href="/roadmap"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ios-blue text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{locale === 'en' ? 'Back to Roadmap' : 'Повернутися до навчання'}</span>
        </Link>
      </div>
    );
  }

  const selectedIsAdmin = isAdminUser(selectedUser);
  const selectedUserOptions = {
    isAdmin: selectedIsAdmin,
    unlockedLessons: selectedUser?.unlockedLessons || [],
    lockedLessons: selectedUser?.lockedLessons || [],
  };

  const totalUnlockedForSelected = LESSONS.filter((lesson) =>
    isLessonUnlocked(
      lesson,
      LESSONS,
      selectedUser?.completedLessons || [],
      selectedUserOptions,
    ),
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {locale === 'en'
                ? `Administrator • ${user.email}`
                : `Адміністратор • ${user.email}`}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {locale === 'en'
              ? 'User Roles & Task Access Control'
              : 'Керування ролями та доступом до завдань'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl">
            {locale === 'en'
              ? `${ADMIN_EMAIL} is the administrator with full access. All other users are classified as students. Select any user below to open or close access to any task or module.`
              : `${ADMIN_EMAIL} — адміністратор із повним доступом. Усі інші користувачі класифікуються як студенти. Оберіть користувача, щоб відкрити або закрити йому доступ до будь-яких завдань.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
          <button
            type="button"
            onClick={() => setConfirmResetAllOpen((prev) => !prev)}
            disabled={isSaving || isLoadingUsers || users.length === 0}
            className="px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>
              {locale === 'en' ? 'Reset All Users Progress' : 'Скинути уроки для всіх'}
            </span>
          </button>
          <button
            onClick={() => void loadUsers()}
            disabled={isLoadingUsers}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? 'animate-spin' : ''}`} />
            <span>{locale === 'en' ? 'Refresh' : 'Оновити список'}</span>
          </button>
          <Link
            href="/roadmap"
            className="px-4 py-2 rounded-xl bg-ios-blue hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{locale === 'en' ? 'Curriculum' : 'До програми'}</span>
          </Link>
        </div>
      </div>

      {/* Bulk Reset Confirmation Panel */}
      {confirmResetAllOpen && (
        <div className="glass-panel p-5 rounded-3xl border border-red-500/40 bg-red-950/20 space-y-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <h3 className="text-sm font-bold text-white">
                {locale === 'en'
                  ? 'Reset lesson completions for all users?'
                  : 'Скинути проходження уроків для всіх користувачів?'}
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {locale === 'en'
                  ? 'This will clear completed lessons, AI challenges, quiz history, and reset XP back to 50 across all selected user accounts on every device.'
                  : 'Ця дія очистить пройдені уроки, зараховані AI-челенджі та поверне початкові 50 XP і 1-й модуль для всіх обраних користувачів на всіх пристроях.'}
              </p>
              <label className="inline-flex items-center gap-2 pt-2 text-xs text-neutral-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={resetAllIncludeAdmins}
                  onChange={(e) => setResetAllIncludeAdmins(e.target.checked)}
                  className="rounded border-white/20 bg-neutral-900 text-ios-blue focus:ring-ios-blue"
                />
                <span>
                  {locale === 'en'
                    ? 'Also reset administrator account progress'
                    : 'Також скинути прогрес акаунту адміністратора'}
                </span>
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setConfirmResetAllOpen(false)}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-neutral-200 text-xs font-semibold transition-colors"
            >
              {locale === 'en' ? 'Cancel' : 'Скасувати'}
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => void handleResetAllUsersProgress()}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-red-600/20 transition-all disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>
                {locale === 'en'
                  ? 'Confirm Reset for All'
                  : 'Підтвердити скидання для всіх'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Notifications */}
      {!isFirebaseReady && (
        <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            {locale === 'en'
              ? 'Firebase is not configured. Changes are saved only in local browser storage and will not sync to other devices.'
              : 'Увага: Firebase не налаштовано. Зміни зберігаються лише локально у цьому браузері та не застосуються для студентів на інших пристроях.'}
          </span>
        </div>
      )}
      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Left = Users List, Right = Selected User Task Access */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Users List & Add User */}
        <div className="lg:col-span-4 space-y-5">
          {/* Add / Find Student by Email */}
          <form
            onSubmit={handleAddStudent}
            className="glass-panel p-5 rounded-3xl border border-white/10 space-y-3"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
              <UserPlus className="w-4 h-4 text-ios-blue" />
              <span>
                {locale === 'en' ? 'Add / Select Student by Email' : 'Додати або знайти студента за Email'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              {locale === 'en'
                ? 'You can configure task access for any student email even before they log in.'
                : 'Введіть email будь-якого користувача, щоб одразу налаштувати йому доступ до завдань.'}
            </p>
            <div className="space-y-2">
              <input
                type="email"
                required
                value={newStudentEmail}
                onChange={(e) => setNewStudentEmail(e.target.value)}
                placeholder="student@gmail.com"
                className="w-full px-3.5 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-ios-blue"
              />
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                placeholder={locale === 'en' ? 'Student name (optional)' : "Ім'я студента (необов'язково)"}
                className="w-full px-3.5 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-ios-blue"
              />
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2.5 px-4 rounded-xl bg-ios-blue hover:bg-blue-600 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                {locale === 'en' ? 'Select / Add Student' : 'Додати / Обрати студента'}
              </button>
            </div>
          </form>

          {/* Registered Users List */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Users className="w-4 h-4 text-ios-blue" />
                <span>{locale === 'en' ? 'Users' : 'Користувачі'}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-semibold">
                {users.length}
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder={locale === 'en' ? 'Filter by email or name...' : 'Пошук за email або іменем...'}
                className="w-full pl-9 pr-3 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-ios-blue"
              />
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto custom-scrollbar pr-1">
              {filteredUsers.map((u) => {
                const isSelected = u.email === selectedEmail;
                const uIsAdmin = isAdminUser(u);

                return (
                  <button
                    key={u.email}
                    type="button"
                    onClick={() => {
                      setSelectedEmail(u.email);
                      setConfirmResetSelectedUser(false);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-ios-blue/15 border-ios-blue shadow-lg shadow-ios-blue/10'
                        : 'bg-neutral-900/70 border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-white truncate">{u.name}</p>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            uIsAdmin
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-ios-blue/20 text-ios-blue border border-ios-blue/30'
                          }`}
                        >
                          {uIsAdmin
                            ? locale === 'en'
                              ? 'Admin'
                              : 'Адмін'
                            : locale === 'en'
                            ? 'Student'
                            : 'Студент'}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate">{u.email}</p>
                      <div className="flex items-center gap-3 text-[10px] text-neutral-500 pt-0.5">
                        <span>
                          {locale === 'en' ? 'Completed:' : 'Пройдено:'}{' '}
                          <strong className="text-neutral-300">{u.completedLessons.length}</strong>/{LESSONS.length}
                        </span>
                        {!uIsAdmin && (u.unlockedLessons.length > 0 || u.lockedLessons.length > 0) && (
                          <span className="text-amber-400 font-medium">
                            • {locale === 'en' ? 'Custom access' : 'Налаштовано адміном'}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected User Task Access Controls */}
        <div className="lg:col-span-8 space-y-6">
          {selectedUser ? (
            <>
              {/* Selected User Summary Header */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-xl sm:text-2xl font-black text-white">
                        {selectedUser.name}
                      </h2>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          selectedIsAdmin
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-ios-blue/20 text-ios-blue border border-ios-blue/30'
                        }`}
                      >
                        {getRoleLabel(selectedUser.role, locale)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">{selectedUser.email}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-white/10 text-right">
                      <span className="block text-[10px] text-neutral-400 uppercase tracking-wider">
                        {locale === 'en' ? 'Accessible Tasks' : 'Відкрито завдань'}
                      </span>
                      <span className="text-base font-black text-emerald-400">
                        {totalUnlockedForSelected} / {LESSONS.length}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedIsAdmin ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                      <span>
                        {locale === 'en'
                          ? 'This user is the Administrator (dp180183fjs@gmail.com) and permanently has full access to all modules and tasks.'
                          : 'Цей користувач є Адміністратором (dp180183fjs@gmail.com) і має постійний повний доступ до всіх модулів та завдань курсу.'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => setConfirmResetSelectedUser((prev) => !prev)}
                        className="px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>
                          {locale === 'en'
                            ? 'Reset Completed Lessons'
                            : 'Скинути пройдені уроки'}
                        </span>
                      </button>

                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                        <input
                          type="text"
                          value={lessonSearch}
                          onChange={(e) => setLessonSearch(e.target.value)}
                          placeholder={locale === 'en' ? 'Search tasks...' : 'Пошук завдання...'}
                          className="w-full pl-9 pr-3 py-1.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-ios-blue"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => void handleSetAllAccess(true)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>{locale === 'en' ? 'Open All Tasks' : 'Відкрити всі завдання'}</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => void handleSetAllAccess(false)}
                        className="px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        <LockKeyhole className="w-3.5 h-3.5" />
                        <span>{locale === 'en' ? 'Close All Tasks' : 'Закрити всі завдання'}</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => void handleResetOverrides()}
                        className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>
                          {locale === 'en' ? 'Reset Access Rules' : 'Скинути правила доступу'}
                        </span>
                      </button>

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => setConfirmResetSelectedUser((prev) => !prev)}
                        className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>
                          {locale === 'en' ? 'Reset Completed Lessons' : 'Скинути пройдені уроки'}
                        </span>
                      </button>
                    </div>

                    {/* Task Search */}
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                      <input
                        type="text"
                        value={lessonSearch}
                        onChange={(e) => setLessonSearch(e.target.value)}
                        placeholder={locale === 'en' ? 'Search tasks...' : 'Пошук завдання...'}
                        className="w-full pl-9 pr-3 py-1.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-ios-blue"
                      />
                    </div>
                  </div>
                )}

                {confirmResetSelectedUser && (
                  <div className="p-4 rounded-2xl bg-red-950/25 border border-red-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                    <p className="text-xs text-red-200 leading-relaxed">
                      {locale === 'en'
                        ? `Reset all completed lessons, AI challenges, and XP (back to 50) for ${selectedUser.email}?`
                        : `Скинути всі пройдені уроки, AI-челенджі та повернути 50 XP для ${selectedUser.email}?`}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setConfirmResetSelectedUser(false)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold"
                      >
                        {locale === 'en' ? 'Cancel' : 'Скасувати'}
                      </button>
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => void handleResetSelectedUserProgress()}
                        className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                      >
                        {locale === 'en' ? 'Confirm Reset' : 'Так, скинути'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Modules & Tasks List */}
              <div className="space-y-6">
                {modulesList.map((mod) => {
                  const modLessons = mod.lessons;
                  const unlockedInModCount = modLessons.filter((l) =>
                    isLessonUnlocked(
                      l,
                      LESSONS,
                      selectedUser.completedLessons,
                      selectedUserOptions,
                    ),
                  ).length;

                  return (
                    <div
                      key={mod.moduleNumber}
                      className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4"
                    >
                      {/* Module Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-ios-blue/20 text-ios-blue text-[11px] font-bold">
                              {locale === 'en' ? `Module ${mod.moduleNumber}` : `Модуль ${mod.moduleNumber}`}
                            </span>
                            <span className="text-xs text-neutral-400">
                              ({unlockedInModCount}/{modLessons.length}{' '}
                              {locale === 'en' ? 'open' : 'відкрито'})
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                            {mod.moduleTitle}
                          </h3>
                        </div>

                        {!selectedIsAdmin && (
                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() => void handleToggleModule(mod.moduleNumber, true)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-all disabled:opacity-50"
                            >
                              <Unlock className="w-3 h-3" />
                              <span>{locale === 'en' ? 'Open Module' : 'Відкрити модуль'}</span>
                            </button>
                            <button
                              type="button"
                              disabled={isSaving}
                              onClick={() => void handleToggleModule(mod.moduleNumber, false)}
                              className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-[11px] font-bold flex items-center gap-1 transition-all disabled:opacity-50"
                            >
                              <LockKeyhole className="w-3 h-3" />
                              <span>{locale === 'en' ? 'Close Module' : 'Закрити модуль'}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Lessons inside Module */}
                      <div className="space-y-2.5">
                        {modLessons.map((lesson) => {
                          const isUnlocked = isLessonUnlocked(
                            lesson,
                            LESSONS,
                            selectedUser.completedLessons,
                            selectedUserOptions,
                          );
                          const isExplicitlyUnlocked =
                            selectedUser.unlockedLessons.includes(lesson.id);
                          const isExplicitlyLocked =
                            selectedUser.lockedLessons.includes(lesson.id);
                          const isStudentCompleted =
                            selectedUser.completedLessons.includes(lesson.id);
                          const isChallengeCompleted = (
                            selectedUser.completedChallenges || []
                          ).some(
                            (k) => k === lesson.id || k.startsWith(`${lesson.id}:`),
                          );
                          const isDefaultUnlocked = isBaseModuleUnlocked(
                            lesson.module,
                            LESSONS,
                            selectedUser.completedLessons,
                          );

                          return (
                            <div
                              key={lesson.id}
                              className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                isUnlocked
                                  ? 'bg-emerald-950/10 border-emerald-500/25'
                                  : 'bg-neutral-900/70 border-white/5'
                              }`}
                            >
                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-400">
                                    {lesson.id}
                                  </span>
                                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                                    {lesson.title}
                                  </h4>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                                  {isUnlocked ? (
                                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                                      <Unlock className="w-3 h-3" />
                                      <span>{locale === 'en' ? 'Open' : 'Доступ відкрито'}</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-red-400 font-semibold">
                                      <LockKeyhole className="w-3 h-3" />
                                      <span>{locale === 'en' ? 'Closed' : 'Доступ закрито'}</span>
                                    </span>
                                  )}

                                  <span className="text-neutral-600">•</span>

                                  <span className="text-neutral-400">
                                    {selectedIsAdmin
                                      ? locale === 'en'
                                        ? 'Admin full access'
                                        : 'Повний доступ адміна'
                                      : isExplicitlyUnlocked
                                      ? locale === 'en'
                                        ? 'Opened manually by admin'
                                        : 'Відкрито вручну адміном'
                                      : isExplicitlyLocked
                                      ? locale === 'en'
                                        ? 'Closed manually by admin'
                                        : 'Закрито вручну адміном'
                                      : isDefaultUnlocked
                                      ? locale === 'en'
                                        ? 'Open by course progression'
                                        : 'Відкрито за прогресом'
                                      : locale === 'en'
                                      ? 'Locked by course progression'
                                      : 'Закрито за прогресом'}
                                  </span>

                                  {isStudentCompleted && (
                                    <>
                                      <span className="text-neutral-600">•</span>
                                      <span className="text-ios-blue font-semibold inline-flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        <span>{locale === 'en' ? 'Completed' : 'Пройдено'}</span>
                                      </span>
                                    </>
                                  )}

                                  {isChallengeCompleted && (
                                    <>
                                      <span className="text-neutral-600">•</span>
                                      <span className="text-purple-300 font-semibold inline-flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        <span>{locale === 'en' ? 'AI Verified' : 'AI пройдено'}</span>
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
                                {(isStudentCompleted || isChallengeCompleted) && (
                                  <button
                                    type="button"
                                    disabled={isSaving}
                                    onClick={() =>
                                      void handleResetSingleLessonProgress(lesson.id)
                                    }
                                    className="px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>
                                      {locale === 'en' ? 'Reset Lesson' : 'Скинути урок'}
                                    </span>
                                  </button>
                                )}

                                {!selectedIsAdmin && (
                                  <button
                                    type="button"
                                    disabled={isSaving}
                                    onClick={() => void handleToggleLesson(lesson.id, isUnlocked)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 ${
                                      isUnlocked
                                        ? 'bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30'
                                        : 'bg-emerald-500 hover:bg-emerald-600 text-neutral-950 shadow-md shadow-emerald-500/20'
                                    }`}
                                  >
                                    {isUnlocked ? (
                                      <>
                                        <LockKeyhole className="w-3.5 h-3.5" />
                                        <span>{locale === 'en' ? 'Close Access' : 'Закрити доступ'}</span>
                                      </>
                                    ) : (
                                      <>
                                        <Unlock className="w-3.5 h-3.5" />
                                        <span>{locale === 'en' ? 'Open Access' : 'Відкрити доступ'}</span>
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center text-neutral-400 text-sm">
              {locale === 'en'
                ? 'Select a user from the list on the left to manage their task access.'
                : 'Оберіть користувача зі списку ліворуч, щоб керувати його доступом до завдань.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
