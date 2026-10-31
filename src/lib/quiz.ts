import type { QuizQuestion } from '@/types';

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateQuizSet(
  pool: QuizQuestion[],
  count = 8,
  random: () => number = Math.random,
): QuizQuestion[] {
  if (count < 1 || pool.length < count) {
    throw new Error(`Quiz requires at least ${count} questions; received ${pool.length}.`);
  }

  const groups = new Map<string, QuizQuestion[]>();
  for (const question of shuffle(pool, random)) {
    const group = groups.get(question.category) ?? [];
    group.push(question);
    groups.set(question.category, group);
  }

  const categories = Array.from(groups.keys());
  const selected: QuizQuestion[] = [];
  while (selected.length < count) {
    for (const category of shuffle(categories, random)) {
      const next = groups.get(category)?.shift();
      if (next) selected.push(next);
      if (selected.length === count) break;
    }
  }

  return shuffle(selected, random).map((question) => {
    const optionOrder = shuffle(question.options.map((_, index) => index), random);
    const translations = question.translations?.en;
    return {
      ...question,
      options: optionOrder.map((index) => question.options[index]),
      correctAnswer: optionOrder.indexOf(question.correctAnswer),
      translations: translations
        ? {
            en: {
              ...translations,
              options: optionOrder.map((index) => translations.options[index]),
            },
          }
        : undefined,
    };
  });
}
