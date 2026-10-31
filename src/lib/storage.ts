export interface UserProgress {
  completedLessons: string[];
  quizScores: Record<string, number>; // quizId: score
  totalXp: number;
  streakDays: number;
  lastActiveDate: string;
  bookmarks: string[];
  currentModule: number;
}

function createDefaultProgress(): UserProgress {
  return {
    completedLessons: [],
    quizScores: {},
    totalXp: 50,
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    bookmarks: [],
    currentModule: 1,
  };
}

const STORAGE_KEY = 'swiftlab_user_progress_v1';

export function getUserProgress(): UserProgress {
  if (typeof window === 'undefined') return createDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProgress();
    return { ...createDefaultProgress(), ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to parse user progress from storage', e);
    return createDefaultProgress();
  }
}

export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress', e);
  }
}

export function markLessonCompleted(lessonId: string, xpReward: number = 25): UserProgress {
  const current = getUserProgress();
  if (!current.completedLessons.includes(lessonId)) {
    current.completedLessons.push(lessonId);
    current.totalXp += xpReward;
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

