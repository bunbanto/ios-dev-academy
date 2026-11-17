import type { ChallengeReviewResult } from '../types';

export const MAX_CHALLENGE_CODE_LENGTH = 6000;
export const MIN_CHALLENGE_NON_WS_LENGTH = 10;

export function normalizeSwiftCode(code: string): string {
  return code
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');
}

export function buildDefaultStarterCode(locale: 'uk' | 'en' = 'uk'): string {
  if (locale === 'en') {
    return [
      '// Write your Swift solution below',
      '// Tip: press "Check with AI" for instant code review',
      '',
    ].join('\n');
  }

  return [
    '// Напишіть ваше рішення на Swift нижче',
    '// Порада: натисніть «Перевірити з AI», щоб отримати миттєвий розбір коду',
    '',
  ].join('\n');
}

export function hasSwiftSyntaxTokens(code: string): boolean {
  const withoutComments = code
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/[^\n]*/g, ' ');

  return /[=(){}:;<>]|(\b(let|var|func|struct|class|enum|import|print|return|if|else|guard|switch|case|for|while|actor|protocol|extension|async|await|try|catch|throw|do|in|true|false|nil)\b)|@\w+/.test(
    withoutComments,
  );
}

export function runLocalChallengePrecheck(params: {
  userCode: string;
  starterCode?: string;
  referenceSolution?: string;
  locale?: 'uk' | 'en';
}): ChallengeReviewResult | null {
  const locale = params.locale === 'en' ? 'en' : 'uk';
  const raw = typeof params.userCode === 'string' ? params.userCode : '';
  const nonWsCount = raw.replace(/\s+/g, '').length;

  if (nonWsCount < MIN_CHALLENGE_NON_WS_LENGTH) {
    return {
      passed: false,
      score: 0,
      verdict:
        locale === 'en'
          ? 'Please write your Swift solution before running a check.'
          : 'Напишіть рішення на Swift перед перевіркою.',
      errors: [
        locale === 'en'
          ? 'The editor has too little code to evaluate.'
          : 'У редакторі замало коду для перевірки завдання.',
      ],
      hints: [
        locale === 'en'
          ? 'Read the task carefully and declare the variables, functions, or types asked for.'
          : 'Уважно прочитайте умову та оголосіть потрібні змінні, функції чи структури.',
      ],
      idiomaticTip:
        locale === 'en'
          ? 'Start with `let` for constants and `var` only when a value changes.'
          : 'Починайте з `let` для незмінних значень і використовуйте `var` лише там, де дані змінюються.',
      source: 'local-precheck',
    };
  }

  if (raw.length > MAX_CHALLENGE_CODE_LENGTH) {
    return {
      passed: false,
      score: 0,
      verdict:
        locale === 'en'
          ? 'Code exceeds the maximum allowed size.'
          : 'Код перевищує максимально допустимий розмір.',
      errors: [
        locale === 'en'
          ? `Maximum code length is ${MAX_CHALLENGE_CODE_LENGTH} characters.`
          : `Максимальна довжина коду для перевірки — ${MAX_CHALLENGE_CODE_LENGTH} символів.`,
      ],
      hints: [
        locale === 'en'
          ? 'Keep only the code relevant to this task.'
          : 'Залиште в редакторі лише код, що стосується цього завдання.',
      ],
      idiomaticTip: '',
      source: 'local-precheck',
    };
  }

  const normalizedUser = normalizeSwiftCode(raw);

  if (params.starterCode && normalizedUser === normalizeSwiftCode(params.starterCode)) {
    return {
      passed: false,
      score: 0,
      verdict:
        locale === 'en'
          ? 'You have not modified the starter template yet.'
          : 'Ви ще не додали своє рішення до початкового шаблону.',
      errors: [
        locale === 'en'
          ? 'The submitted code is identical to the starter template.'
          : 'Надісланий код повністю збігається з початковим шаблоном.',
      ],
      hints: [
        locale === 'en'
          ? 'Implement the task requirements in Swift below the starter comments.'
          : 'Допишіть реалізацію задачі на Swift нижче коментарів.',
      ],
      idiomaticTip: '',
      source: 'local-precheck',
    };
  }

  if (!hasSwiftSyntaxTokens(raw)) {
    return {
      passed: false,
      score: 5,
      verdict:
        locale === 'en'
          ? 'This looks like plain text rather than Swift code.'
          : 'Схоже на звичайний текст або коментарі замість коду Swift.',
      errors: [
        locale === 'en'
          ? 'No valid Swift declarations or expressions were detected.'
          : 'Не знайдено жодного оголошення чи виразу Swift (`let`, `var`, `func`, `struct`, `print` тощо).',
      ],
      hints: [
        locale === 'en'
          ? 'Write actual Swift code instead of comments or a text description.'
          : 'Напишіть саме робочий код Swift, а не текстовий опис або коментар.',
      ],
      idiomaticTip: '',
      source: 'local-precheck',
    };
  }

  if (
    params.referenceSolution &&
    normalizedUser === normalizeSwiftCode(params.referenceSolution)
  ) {
    return {
      passed: true,
      score: 100,
      verdict:
        locale === 'en'
          ? 'Exact match with the reference Swift solution!'
          : 'Чудово! Код повністю відповідає еталонному рішенню на Swift.',
      errors: [],
      hints: [],
      idiomaticTip:
        locale === 'en'
          ? 'Try modifying edge-case inputs or generating a bonus AI exercise to practice further.'
          : 'Спробуйте змінити вхідні дані або згенеруйте нову AI-задачу по цій темі, щоб закріпити навичку.',
      source: 'cache',
    };
  }

  return null;
}
