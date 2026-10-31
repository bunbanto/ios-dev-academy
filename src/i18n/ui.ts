import type { Locale } from './LocaleContext';
import enTranslations from '@/data/en-translations.json';

const ui: Record<string, string> = {
  'Програма': 'Curriculum', 'Симулятор': 'Simulator', 'Тренажер': 'Quiz', 'Шпаргалка': 'Cheat Sheet', 'Проєкти': 'Projects',
  'Прогрес курсу': 'Course progress', 'Профіль користувача': 'User profile', 'Google Верифікація': 'Google verified',
  'Email Верифіковано': 'Email verified', 'Потрібна верифікація': 'Verification required', 'Особистий кабінет': 'My account',
  'Мій Сертифікат': 'My certificate', 'Вийти з акаунту': 'Sign out', 'Увійти': 'Sign in', 'Закрити меню': 'Close menu',
  'Відкрити меню': 'Open menu', 'Кабінет': 'Account', 'Увійти через Google або Email': 'Sign in with Google or email',
  'дн. поспіль': 'days in a row', 'XP зароблено': 'XP earned', 'Вийти з облікового запису': 'Sign out', 'Увійти в акаунт': 'Sign in',
  'Перевірка авторизації...': 'Checking authentication...', 'Швидкі посилання': 'Quick links', 'Навчання': 'Learning',
  'Усі права захищені': 'All rights reserved', 'Змінити мову': 'Change language',
  'Копіювати': 'Copy', 'Скопійовано!': 'Copied!', 'Скопійовано': 'Copied', 'Копіювати синтаксис': 'Copy syntax',
  'Прогрес': 'Progress', 'Початковий': 'Beginner', 'Середній': 'Intermediate', 'Просунутий': 'Advanced',
  'Не вдалося увійти через Google. Спробуйте ще раз.': 'Could not sign in with Google. Please try again.',
  'Введіть коректну електронну адресу': 'Enter a valid email address.',
  'Не вдалося надіслати запит. Спробуйте ще раз пізніше.': 'Could not send the request. Please try again later.',
  'Невірний код верифікації. Перевірте код або надішліть новий.': 'The verification code is incorrect. Check it or request a new one.',
  'Помилка підтвердження. Спробуйте ще раз.': 'Verification failed. Please try again.',
  'Firebase не налаштовано на Vercel! Додайте змінні NEXT_PUBLIC_FIREBASE_* у Vercel Dashboard ➔ Settings ➔ Environment Variables і зробіть Redeploy.': 'Firebase is not configured on Vercel. Add the NEXT_PUBLIC_FIREBASE_* variables in Vercel Dashboard → Settings → Environment Variables, then redeploy.',
  'Firebase ще не налаштовано локально. Створіть файл .env.local із параметрами вашого проєкту Firebase (див. .env.example).': 'Firebase is not configured locally. Create a .env.local file with your Firebase project settings (see .env.example).',
  'Вікно входу Google було закрите до завершення авторизації.': 'The Google sign-in window was closed before authentication finished.',
  'Попередній запит було скасовано.': 'The previous request was cancelled.',
  'Помилка авторизації через Google.': 'Google sign-in failed.',
  'Ви вивчаєте Swift 6 та SwiftUI для створення власного застосунку в App Store.': 'I am learning Swift 6 and SwiftUI to build my own app for the App Store.',
  'Розробник': 'Developer',
  'Junior iOS Початківець': 'Junior iOS Beginner',
  'Middle iOS Архітектор': 'Middle iOS Architect',
  'Junior+ iOS Розробник': 'Junior+ iOS Developer',
  'SwiftUI Практик': 'SwiftUI Practitioner',
  'Вивчаю Swift 6 та SwiftUI для створення власного застосунку в App Store.': 'I am learning Swift 6 and SwiftUI to build my own app for the App Store.',
  'Початківець у світі мобільної розробки під екосистему Apple.': 'Beginner in Apple ecosystem mobile development.',
  'д': 'd',
  'мин': 'min',
  'хв': 'min',
  'Повторити': 'Retake',
  'Вчити': 'Study',
  '✓ Розблоковано': '✓ Unlocked',
  'Заблоковано': 'Locked',
  'Сховати інструкцію': 'Hide instructions',
  'Покроковий план': 'Step-by-step guide',
  'Наступне питання': 'Next question',
};

export function t(text: string, locale: Locale): string {
  return locale === 'en' ? ui[text] ?? (enTranslations as Record<string, string>)[text] ?? text : text;
}
