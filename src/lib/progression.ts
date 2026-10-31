import type { Lesson } from '@/types';

export function isModuleUnlocked(moduleNumber: number, lessons: Lesson[], completedIds: string[]): boolean {
  const firstModule = Math.min(...lessons.map((lesson) => lesson.module));
  if (!Number.isFinite(firstModule) || moduleNumber <= firstModule) return true;

  const requiredModules = Array.from(new Set(lessons.map((lesson) => lesson.module)))
    .filter((module) => module < moduleNumber);

  return requiredModules.every((module) => {
    const moduleLessons = lessons.filter((lesson) => lesson.module === module);
    return moduleLessons.length > 0 && moduleLessons.every((lesson) => completedIds.includes(lesson.id));
  });
}
