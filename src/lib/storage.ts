export interface UserProgress {
  completedLessons: string[];
  quizScores: Record<string, number>; // quizId: score
  totalXp: number;
  streakDays: number;
  lastActiveDate: string;
  bookmarks: string[];
  currentModule: number;
}

const DEFAULT_PROGRESS: UserProgress = {
  completedLessons: [],
  quizScores: {},
  totalXp: 50,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  bookmarks: [],
  currentModule: 1,
};

const STORAGE_KEY = 'swiftlab_user_progress_v1';

export function getUserProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to parse user progress from storage', e);
    return DEFAULT_PROGRESS;
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

