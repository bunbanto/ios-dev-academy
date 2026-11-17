import { describe, expect, it } from 'vitest';
import { LESSONS } from '../data/lessons/index';
import { LESSONS_EN } from '../data/lessons/en/index';
import { findChallengeContext } from './server/challenge-checker';
import { computeUpdatedStreak, createDefaultProgress, type UserProgress } from './storage';
import { mergeUserProgress } from './progress-sync';

describe('module challenge coverage and cross-device progress sync', () => {
  it('ensures every lesson across all 7 modules (UK and EN) has a verifiable practice challenge', () => {
    expect(LESSONS.length).toBeGreaterThanOrEqual(24);
    expect(LESSONS_EN.length).toBe(LESSONS.length);

    for (const lesson of LESSONS) {
      const lastPageWithChallenge = lesson.pages?.find((p) => Boolean(p.content.challenge));
      const ctxUk = findChallengeContext({
        lessonId: lesson.id,
        pageId: lastPageWithChallenge?.id,
        locale: 'uk',
      });
      const ctxEn = findChallengeContext({
        lessonId: lesson.id,
        pageId: lastPageWithChallenge?.id,
        locale: 'en',
      });

      expect(ctxUk, `Missing UK challenge for ${lesson.id}`).not.toBeNull();
      expect(ctxEn, `Missing EN challenge for ${lesson.id}`).not.toBeNull();
    }
  });

  it('restores cloud progress on a brand new device without resetting to defaults', () => {
    const freshLocal = createDefaultProgress();
    const cloud: UserProgress = {
      ownerUid: 'uid-1',
      completedLessons: ['swift-basics-variables', 'swift-control-flow'],
      completedChallenges: ['swift-basics-variables:step-5-xcode-lab-challenge'],
      quizScores: { 'quiz-1': 7 },
      totalXp: 260,
      streakDays: 4,
      lastActiveDate: '2026-11-17',
      bookmarks: ['swift-optionals-unwrapping'],
      currentModule: 2,
      lastLessonId: 'swift-optionals-unwrapping',
      lastPageIndex: 2,
      updatedAt: '2026-11-17T10:00:00.000Z',
    };

    const { merged, shouldPushToCloud } = mergeUserProgress(freshLocal, cloud, 'uid-1');

    expect(shouldPushToCloud).toBe(false);
    expect(merged.completedLessons).toEqual(cloud.completedLessons);
    expect(merged.completedChallenges).toEqual(cloud.completedChallenges);
    expect(merged.totalXp).toBe(260);
    expect(merged.streakDays).toBe(4);
    expect(merged.lastLessonId).toBe('swift-optionals-unwrapping');
    expect(merged.lastPageIndex).toBe(2);
  });

  it('merges offline completions from a second device without double-counting existing cloud XP', () => {
    const localOffline: UserProgress = {
      ownerUid: 'uid-1',
      completedLessons: ['swift-basics-variables', 'swift-optionals-unwrapping'],
      completedChallenges: ['swift-optionals-unwrapping:optionals-lab-challenge'],
      quizScores: {},
      totalXp: 95,
      streakDays: 2,
      lastActiveDate: '2026-11-17',
      bookmarks: [],
      currentModule: 1,
      updatedAt: '2026-11-17T12:00:00.000Z',
    };

    const cloud: UserProgress = {
      ownerUid: 'uid-1',
      completedLessons: ['swift-basics-variables'],
      completedChallenges: [],
      quizScores: { 'quiz-1': 5 },
      totalXp: 175,
      streakDays: 1,
      lastActiveDate: '2026-11-16',
      bookmarks: ['swift-control-flow'],
      currentModule: 1,
      updatedAt: '2026-11-16T18:00:00.000Z',
    };

    const { merged, shouldPushToCloud } = mergeUserProgress(localOffline, cloud, 'uid-1');

    expect(shouldPushToCloud).toBe(true);
    expect(merged.completedLessons).toEqual([
      'swift-basics-variables',
      'swift-optionals-unwrapping',
    ]);
    // Cloud 175 + 25 (new lesson) + 20 (new challenge) = 220
    expect(merged.totalXp).toBe(220);
    expect(merged.bookmarks).toEqual(['swift-control-flow']);
    expect(merged.streakDays).toBe(2);
  });

  it('does not leak local progress from one signed-in user to another user on the same browser', () => {
    const previousUserLocal: UserProgress = {
      ownerUid: 'uid-previous',
      completedLessons: ['swift-basics-variables', 'swift-control-flow'],
      completedChallenges: ['c1'],
      quizScores: { q1: 8 },
      totalXp: 500,
      streakDays: 10,
      lastActiveDate: '2026-11-17',
      bookmarks: ['b1'],
      currentModule: 5,
      updatedAt: '2026-11-17T12:00:00.000Z',
    };

    const newUserCloud: UserProgress = {
      ownerUid: 'uid-new',
      completedLessons: [],
      completedChallenges: [],
      quizScores: {},
      totalXp: 50,
      streakDays: 1,
      lastActiveDate: '2026-11-17',
      bookmarks: [],
      currentModule: 1,
      updatedAt: '2026-11-17T12:05:00.000Z',
    };

    const { merged, shouldPushToCloud } = mergeUserProgress(
      previousUserLocal,
      newUserCloud,
      'uid-new',
    );

    expect(shouldPushToCloud).toBe(false);
    expect(merged.ownerUid).toBe('uid-new');
    expect(merged.completedLessons).toEqual([]);
    expect(merged.totalXp).toBe(50);
  });

  it('updates daily learning streak accurately across consecutive and missed days', () => {
    expect(computeUpdatedStreak('2026-11-17', 3, '2026-11-17')).toEqual({
      streakDays: 3,
      lastActiveDate: '2026-11-17',
    });
    expect(computeUpdatedStreak('2026-11-16', 3, '2026-11-17')).toEqual({
      streakDays: 4,
      lastActiveDate: '2026-11-17',
    });
    expect(computeUpdatedStreak('2026-11-14', 5, '2026-11-17')).toEqual({
      streakDays: 1,
      lastActiveDate: '2026-11-17',
    });
  });
});
