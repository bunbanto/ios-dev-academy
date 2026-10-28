import { Achievement } from '@/types';
import { UserProgress } from '@/lib/storage';

export const BASE_ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'verified_account',
    title: 'Верифікований розробник',
    description: 'Підтвердити свій обліковий запис через Google або Email OTP.',
    icon: 'ShieldCheck',
    xpReward: 50,
  },
  {
    id: 'first_lesson',
    title: 'Перший крок у Swift',
    description: 'Успішно завершити свій перший практичний урок у дорожній карті.',
    icon: 'Sparkles',
    xpReward: 30,
  },
  {
    id: 'swiftui_master',
    title: 'SwiftUI Архітектор',
    description: 'Пройти модуль зі стеків (VStack, HStack, ZStack) та модифікаторів.',
    icon: 'Smartphone',
    xpReward: 50,
  },
  {
    id: 'state_ninja',
    title: 'Data Flow Самурай',
    description: 'Опанувати @State, @Binding та сучасний макрос @Observable.',
    icon: 'Zap',
    xpReward: 60,
  },
  {
    id: 'network_concurrency',
    title: 'Асинхронний Майстер',
    description: 'Вивчити асинхронні запити URLSession та роботу з async/await.',
    icon: 'Globe',
    xpReward: 70,
  },
  {
    id: 'quiz_hero',
    title: 'Знавець співбесід',
    description: 'Дати правильні відповіді на запитання в тренажері квізів.',
    icon: 'Award',
    xpReward: 80,
  },
  {
    id: 'persistence_guru',
    title: 'SwiftData Гуру',
    description: 'Завершити модуль локальної бази даних та звʼязку моделей.',
    icon: 'Database',
    xpReward: 100,
  },
];

export function computeAchievements(progress: UserProgress, isVerified: boolean): Achievement[] {
  const completed = progress.completedLessons || [];
  const quizScores = progress.quizScores || {};
  const hasQuizPassed = Object.keys(quizScores).length > 0;

  return BASE_ACHIEVEMENTS.map((badge) => {
    let unlocked = false;

    switch (badge.id) {
      case 'verified_account':
        unlocked = isVerified;
        break;
      case 'first_lesson':
        unlocked = completed.length >= 1;
        break;
      case 'swiftui_master':
        unlocked = completed.some((id) => id.includes('swiftui') || id.includes('stacks'));
        break;
      case 'state_ninja':
        unlocked = completed.some((id) => id.includes('state') || id.includes('data-flow'));
        break;
      case 'network_concurrency':
        unlocked = completed.some((id) => id.includes('async') || id.includes('network') || id.includes('concurrency'));
        break;
      case 'quiz_hero':
        unlocked = hasQuizPassed;
        break;
      case 'persistence_guru':
        unlocked = completed.some((id) => id.includes('swiftdata') || id.includes('persistence'));
        break;
    }

    return {
      ...badge,
      unlocked,
      unlockedAt: unlocked ? new Date().toISOString() : undefined,
    };
  });
}

