import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getUserProgress,
  markLessonCompleted,
  saveUserProgress,
  toggleBookmark,
  type UserProgress,
} from './storage';

const values = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => values.get(key) ?? null,
  setItem: (key: string, value: string) => values.set(key, value),
};

beforeEach(() => {
  values.clear();
  vi.stubGlobal('window', {});
  vi.stubGlobal('localStorage', localStorageMock);
});

describe('user progress storage', () => {
  it('returns default progress when no saved data exists', () => {
    expect(getUserProgress()).toMatchObject({
      completedLessons: [],
      quizScores: {},
      totalXp: 50,
      streakDays: 1,
      bookmarks: [],
      currentModule: 1,
    });
  });

  it('merges saved values with defaults and falls back on invalid JSON', () => {
    values.set('swiftlab_user_progress_v1', JSON.stringify({ totalXp: 80 }));
    expect(getUserProgress()).toMatchObject({ totalXp: 80, completedLessons: [], currentModule: 1 });

    values.set('swiftlab_user_progress_v1', '{invalid');
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(getUserProgress()).toMatchObject({ totalXp: 50, completedLessons: [] });
  });

  it('saves and reloads progress', () => {
    const progress: UserProgress = { ...getUserProgress(), totalXp: 125 };
    saveUserProgress(progress);
    expect(getUserProgress().totalXp).toBe(125);
  });

  it('awards lesson XP once, even if completion is repeated', () => {
    expect(markLessonCompleted('lesson-1', 30).totalXp).toBe(80);
    expect(markLessonCompleted('lesson-1', 30).totalXp).toBe(80);
    expect(getUserProgress().completedLessons).toEqual(['lesson-1']);
  });

  it('toggles a bookmark on and off', () => {
    expect(toggleBookmark('lesson-1')).toBe(true);
    expect(getUserProgress().bookmarks).toEqual(['lesson-1']);
    expect(toggleBookmark('lesson-1')).toBe(false);
    expect(getUserProgress().bookmarks).toEqual([]);
  });
});
