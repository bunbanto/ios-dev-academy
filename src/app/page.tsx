'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Smartphone,
  BookOpen,
  Award,
  Terminal,
  Zap,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Flame,
  ChevronRight,
  Layers,
  Code2
} from 'lucide-react';
import IPhoneMockup from '@/components/IPhoneMockup';
import { LESSONS } from '@/data/lessons';
import { QUIZ_QUESTIONS } from '@/data/quiz';
import { getUserProgress, UserProgress } from '@/lib/storage';

export default function HomePage() {
  const [activeInteractiveMode, setActiveInteractiveMode] = useState<'counter' | 'profile' | 'todo' | 'biometric'>('counter');
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setUserProgress(getUserProgress());
  }, []);

  const totalLessons = LESSONS.length;
  const completedCount = userProgress?.completedLessons.length || 0;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-16 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-ios-blue/20 via-purple-600/20 to-pink-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ios-blue/10 border border-ios-blue/30 text-ios-blue text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Оновлено під Swift 6.0 та iOS 18</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                Опануй розробку для <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-ios-blue via-purple-400 to-pink-500">
                  iPhone та iPad
                </span>{' '}
                з нуля
              </h1>

              <p className="text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Інтерактивна українська платформа для вивчення <strong>Swift</strong> та <strong>SwiftUI</strong>. Проходьте практичні модулі, пишіть сучасний декларативний код та одразу тестуйте його у вбудованому симуляторі iPhone 16 Pro!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/roadmap"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-ios-blue hover:bg-blue-600 text-white font-semibold text-sm shadow-lg shadow-ios-blue/25 hover:shadow-ios-blue/40 transition-all flex items-center justify-center gap-2 group"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Розпочати навчання</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/simulator"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-800/80 hover:bg-neutral-700/80 text-white font-semibold text-sm border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4 text-ios-blue" />
                  <span>Відкрити iPhone Симулятор</span>
                </Link>
              </div>

              {/* Social Proof / Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-left">
                <div>
                  <div className="text-2xl font-bold text-white">7+</div>
                  <div className="text-xs text-neutral-400">Модулів від 0 до Pro</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-ios-blue">100%</div>
                  <div className="text-xs text-neutral-400">Практика на SwiftUI</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-400">Vercel</div>
                  <div className="text-xs text-neutral-400">Миттєвий деплой</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Phone Mockup with Mode Switcher */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {/* Interactive Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-neutral-900/90 rounded-2xl border border-white/10 mb-4 text-xs">
                <button
                  onClick={() => setActiveInteractiveMode('counter')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                    activeInteractiveMode === 'counter'
                      ? 'bg-ios-blue text-white shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Кава (@State)
                </button>
                <button
                  onClick={() => setActiveInteractiveMode('profile')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                    activeInteractiveMode === 'profile'
                      ? 'bg-ios-blue text-white shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Картка
                </button>
                <button
                  onClick={() => setActiveInteractiveMode('todo')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                    activeInteractiveMode === 'todo'
                      ? 'bg-ios-blue text-white shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Завдання
                </button>
                <button
                  onClick={() => setActiveInteractiveMode('biometric')}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                    activeInteractiveMode === 'biometric'
                      ? 'bg-ios-blue text-white shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Face ID
                </button>
              </div>

              {/* The Live Interactive Phone */}
              <IPhoneMockup interactiveType={activeInteractiveMode} />
              <p className="text-[11px] text-neutral-400 mt-2 text-center">
                ✨ Клікайте на екран iPhone — кнопки, поля та скрол є повністю інтерактивними!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Progress Bar (if in progress) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-xs font-semibold text-ios-blue uppercase tracking-wider">
                Ваш прогрес в курсі
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white">
                {completedCount} з {totalLessons} уроків
              </span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {completedCount === 0
                ? 'Ви ще не розпочали перший урок'
                : `Пройдено ${progressPercent}% навчальної програми`}
            </h3>
          </div>

          <div className="w-full sm:w-1/3 space-y-2">
            <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-ios-blue to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-neutral-400">
              <span>{userProgress?.totalXp || 50} Зароблено XP</span>
              <span>Рівень: Junior iOS</span>
            </div>
          </div>

          <Link
            href="/roadmap"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all whitespace-nowrap"
          >
            Продовжити навчання →
          </Link>
        </div>
      </section>

      {/* Core Features Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Чому саме SwiftLab для вивчення iOS?
          </h2>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto">
            Ми зібрали тільки актуальні практики Apple станом на 2026 рік: жодного застарілого UIKit бойлерплейту, тільки чистий SwiftUI, SwiftData та Concurrency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-3xl hover:border-ios-blue/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-ios-blue/20 text-ios-blue flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Живий iPhone Симулятор</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Не потрібно чекати завантаження важкого Xcode! Змінюйте параметри та одразу спостерігайте рендеринг у віртуальному iPhone 16 Pro з Dynamic Island.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl hover:border-purple-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Сучасний стек Swift 6</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Макроси, @Observable, async/await, SwiftData замість застарілого CoreData. Усе те, що зараз вимагають на співбесідах у провідних IT-компаніях.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl hover:border-emerald-500/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Підготовка до оферу</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Тестові питання зі співбесід на Junior/Middle позиції, розбір пасток із опціоналами, витоками памʼяті (ARC) та готове портфоліо додатків.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Lessons / Modules Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white">Програма навчання</h2>
            <p className="text-xs text-neutral-400">Покроковий шлях від першого рядка коду до App Store</p>
          </div>
          <Link
            href="/roadmap"
            className="text-xs font-semibold text-ios-blue hover:underline flex items-center gap-1"
          >
            <span>Всі уроки ({LESSONS.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LESSONS.slice(0, 4).map((lesson, idx) => (
            <Link
              key={lesson.id}
              href={`/lessons/${lesson.id}`}
              className="glass-card p-5 rounded-2xl hover:border-ios-blue/40 transition-all flex items-start gap-4 group"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-ios-blue font-bold text-sm group-hover:bg-ios-blue group-hover:text-white transition-colors flex-shrink-0">
                0{idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold text-ios-blue uppercase tracking-wider">
                    {lesson.moduleTitle.split(':')[0]}
                  </span>
                  <span className="text-[10px] text-neutral-500">• {lesson.estimatedMinutes} хв</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-ios-blue transition-colors truncate">
                  {lesson.title}
                </h4>
                <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                  {lesson.description}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0 self-center" />
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Quiz Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-blue-950/80 p-8 sm:p-10 rounded-3xl border border-indigo-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-yellow-400" />
              <span>Тренажер Співбесіди</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Перевір свої знання з iOS Розробки
            </h3>
            <p className="text-sm text-neutral-300 max-w-xl">
              Пройдіть бліц-тест із реальних запитань: різниця Struct vs Class, опціонали, [weak self], життєвий цикл SwiftUI та Concurrency.
            </p>
          </div>

          <Link
            href="/quiz"
            className="px-8 py-4 rounded-2xl bg-white text-neutral-900 hover:bg-neutral-100 font-bold text-sm shadow-xl hover:scale-105 transition-all whitespace-nowrap flex items-center gap-2"
          >
            <span>Пройти тест ({QUIZ_QUESTIONS.length} питань)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Personal Cabinet & Certification Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Особистий кабінет & Верифікація</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Отримайте офіційний іменний сертифікат SwiftLab
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Увійдіть через Google або Email, підтвердіть профіль, відстежуйте свій рівень XP та завантажуйте персональний сертифікат для резюме та LinkedIn.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              href="/profile"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-ios-blue to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-xs shadow-lg shadow-ios-blue/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Відкрити кабінет</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/profile?tab=certificate"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-yellow-400" />
              <span>Зразок сертифіката</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

