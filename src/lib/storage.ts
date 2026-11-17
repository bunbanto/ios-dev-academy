export interface UserProgress {
  ownerUid?: string;
  completedLessons: string[];
  completedChallenges?: string[];
  quizScores: Record<string, number>; // quizId: score
  totalXp: number;
  streakDays: number;
  lastActiveDate: string;
  bookmarks: string[];
  currentModule: number;
  lastLessonId?: string;
  lastPageIndex?: number;
  progressResetAt?: string;
  updatedAt?: string;
}

export function getUtcDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function createDefaultProgress(ownerUid?: string): UserProgress {
  return {
    ...(ownerUid ? { ownerUid } : {}),
    completedLessons: [],
    completedChallenges: [],
    quizScores: {},
    totalXp: 50,
    streakDays: 1,
    lastActiveDate: getUtcDateString(),
    bookmarks: [],
    currentModule: 1,
    updatedAt: new Date().toISOString(),
  };
}

export function computeUpdatedStreak(
  lastActiveDate: string | undefined,
  currentStreak: number,
  today: string = getUtcDateString(),
): { streakDays: number; lastActiveDate: string } {
  const safeStreak = Number.isFinite(currentStreak) && currentStreak >= 1 ? Math.floor(currentStreak) : 1;
  if (!lastActiveDate || !/^\d{4}-\d{2}-\d{2}$/.test(lastActiveDate)) {
    return { streakDays: 1, lastActiveDate: today };
  }
  if (lastActiveDate === today) {
    return { streakDays: safeStreak, lastActiveDate: today };
  }

  const prevTime = Date.parse(`${lastActiveDate}T00:00:00Z`);
  const todayTime = Date.parse(`${today}T00:00:00Z`);
  if (!Number.isFinite(prevTime) || !Number.isFinite(todayTime)) {
    return { streakDays: 1, lastActiveDate: today };
  }

  const diffDays = Math.round((todayTime - prevTime) / (24 * 60 * 60 * 1000));
  if (diffDays === 1) {
    return { streakDays: safeStreak + 1, lastActiveDate: today };
  }
  if (diffDays < 0) {
    return { streakDays: safeStreak, lastActiveDate };
  }
  return { streakDays: 1, lastActiveDate: today };
}

const STORAGE_KEY = 'swiftlab_user_progress_v1';

export function getUserProgress(): UserProgress {
  if (typeof window === 'undefined') return createDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProgress();
    const parsed = JSON.parse(raw);
    const merged: UserProgress = { ...createDefaultProgress(), ...parsed };
    if (!Array.isArray(merged.completedLessons)) merged.completedLessons = [];
    if (!Array.isArray(merged.completedChallenges)) merged.completedChallenges = [];
    if (!Array.isArray(merged.bookmarks)) merged.bookmarks = [];
    if (!merged.quizScores || typeof merged.quizScores !== 'object') merged.quizScores = {};
    return merged;
  } catch (e) {
    console.error('Failed to parse user progress from storage', e);
    return createDefaultProgress();
  }
}

export function writeProgressToLocalStorage(
  progress: UserProgress,
  options: { notifyCloudSync?: boolean } = {},
): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    if (typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new Event('swiftlab_progress_change'));
      if (options.notifyCloudSync) {
        window.dispatchEvent(new Event('swiftlab_progress_dirty'));
      }
    }
  } catch (e) {
    console.error('Failed to save user progress', e);
  }
}

export function saveUserProgress(progress: UserProgress): void {
  const next: UserProgress = {
    ...progress,
    updatedAt: new Date().toISOString(),
  };
  writeProgressToLocalStorage(next, { notifyCloudSync: true });
}

export function clearLocalUserProgress(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    if (typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new Event('swiftlab_progress_change'));
    }
  } catch (e) {
    console.error('Failed to clear user progress', e);
  }
}

export function markLessonCompleted(lessonId: string, xpReward: number = 25): UserProgress {
  const current = getUserProgress();
  const streak = computeUpdatedStreak(current.lastActiveDate, current.streakDays);
  const changed =
    !current.completedLessons.includes(lessonId) ||
    streak.lastActiveDate !== current.lastActiveDate ||
    streak.streakDays !== current.streakDays;

  if (!current.completedLessons.includes(lessonId)) {
    current.completedLessons = [...current.completedLessons, lessonId];
    current.totalXp += xpReward;
  }
  current.streakDays = streak.streakDays;
  current.lastActiveDate = streak.lastActiveDate;

  if (changed) {
    saveUserProgress(current);
  }
  return current;
}

export function markChallengeCompleted(challengeKey: string, xpReward: number = 20): UserProgress {
  const current = getUserProgress();
  const completed = current.completedChallenges ?? [];
  const streak = computeUpdatedStreak(current.lastActiveDate, current.streakDays);
  const changed =
    !completed.includes(challengeKey) ||
    streak.lastActiveDate !== current.lastActiveDate ||
    streak.streakDays !== current.streakDays;

  if (!completed.includes(challengeKey)) {
    current.completedChallenges = [...completed, challengeKey];
    current.totalXp += xpReward;
  }
  current.streakDays = streak.streakDays;
  current.lastActiveDate = streak.lastActiveDate;

  if (changed) {
    saveUserProgress(current);
  }
  return current;
}

export function recordQuizCompletion(correctAnswers: number, xpPerCorrect: number = 20): UserProgress {
  const current = getUserProgress();
  const streak = computeUpdatedStreak(current.lastActiveDate, current.streakDays);
  current.totalXp += Math.max(0, correctAnswers) * xpPerCorrect;
  current.quizScores = {
    ...(current.quizScores || {}),
    [`quiz-${Date.now()}`]: correctAnswers,
  };
  current.streakDays = streak.streakDays;
  current.lastActiveDate = streak.lastActiveDate;
  saveUserProgress(current);
  return current;
}

export function recordLessonVisit(
  lessonId: string,
  pageIndex: number = 0,
  moduleNumber: number = 1,
): UserProgress {
  const current = getUserProgress();
  const streak = computeUpdatedStreak(current.lastActiveDate, current.streakDays);
  const safePage = Number.isInteger(pageIndex) && pageIndex >= 0 ? pageIndex : 0;
  const safeModule = Number.isInteger(moduleNumber) && moduleNumber >= 1 ? moduleNumber : 1;

  const unchanged =
    current.lastLessonId === lessonId &&
    (current.lastPageIndex ?? 0) === safePage &&
    current.currentModule === safeModule &&
    streak.lastActiveDate === current.lastActiveDate &&
    streak.streakDays === current.streakDays;

  if (unchanged) return current;

  current.lastLessonId = lessonId;
  current.lastPageIndex = safePage;
  current.currentModule = safeModule;
  current.streakDays = streak.streakDays;
  current.lastActiveDate = streak.lastActiveDate;
  saveUserProgress(current);
  return current;
}

export function awardBonusXp(amount: number): UserProgress {
  const current = getUserProgress();
  if (amount > 0) {
    current.totalXp += amount;
    saveUserProgress(current);
  }
  return current;
}

export function toggleBookmark(lessonId: string): boolean {
  const current = getUserProgress();
  const index = current.bookmarks.indexOf(lessonId);
  let isBookmarked = false;
  if (index > -1) {
    current.bookmarks.splice(index, 1);
    isBookmarked = false;
  } else {
    current.bookmarks.push(lessonId);
    isBookmarked = true;
  }
  saveUserProgress(current);
  return isBookmarked;
}
