import type { Lesson } from '@/types';

export interface AccessOptions {
  isAdmin?: boolean;
  unlockedLessons?: string[];
  lockedLessons?: string[];
}

export function isBaseModuleUnlocked(moduleNumber: number, lessons: Lesson[], completedIds: string[]): boolean {
  const firstModule = Math.min(...lessons.map((lesson) => lesson.module));
  if (!Number.isFinite(firstModule) || moduleNumber <= firstModule) return true;

  const requiredModules = Array.from(new Set(lessons.map((lesson) => lesson.module)))
    .filter((module) => module < moduleNumber);

  return requiredModules.every((module) => {
    const moduleLessons = lessons.filter((lesson) => lesson.module === module);
    return moduleLessons.length > 0 && moduleLessons.every((lesson) => completedIds.includes(lesson.id));
  });
}

export function isLessonUnlocked(
  lesson: Lesson,
  lessons: Lesson[],
  completedIds: string[],
  options?: AccessOptions,
): boolean {
  if (options?.isAdmin) return true;
  if (options?.lockedLessons?.includes(lesson.id)) return false;
  if (options?.unlockedLessons?.includes(lesson.id)) return true;

  return isBaseModuleUnlocked(lesson.module, lessons, completedIds);
}

export function isModuleUnlocked(
  moduleNumber: number,
  lessons: Lesson[],
  completedIds: string[],
  options?: AccessOptions,
): boolean {
  if (options?.isAdmin) return true;

  const moduleLessons = lessons.filter((lesson) => lesson.module === moduleNumber);
  if (moduleLessons.length === 0) {
    return isBaseModuleUnlocked(moduleNumber, lessons, completedIds);
  }

  return moduleLessons.some((lesson) => isLessonUnlocked(lesson, lessons, completedIds, options));
}

export function lessonHasChallenge(lesson?: Lesson | null): boolean {
  if (!lesson) return false;
  return Boolean(
    lesson.content?.challenge ||
      lesson.pages?.some((page) => Boolean(page.content?.challenge)),
  );
}

export function isLessonChallengeSolved(
  lesson: Lesson | undefined | null,
  completedChallenges: string[] = [],
  options?: { isAdmin?: boolean },
): boolean {
  if (options?.isAdmin) return true;
  if (!lesson || !lessonHasChallenge(lesson)) return true;

  return completedChallenges.some(
    (key) => key === lesson.id || key.startsWith(`${lesson.id}:`),
  );
}
