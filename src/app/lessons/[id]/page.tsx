'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Check,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LESSONS } from '@/data/lessons';
import CodeBlock from '@/components/CodeBlock';
import { getUserProgress, markLessonCompleted, UserProgress } from '@/lib/storage';

export default function LessonDetailPage() {
  const params = useParams();
  const lessonId = params?.id as string;
  const lessonIndex = LESSONS.findIndex((l) => l.id === lessonId);

  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const lesson = LESSONS[lessonIndex];

  useEffect(() => {
    if (lessonId) {
      const progress = getUserProgress();
      setIsCompleted(progress.completedLessons.includes(lessonId));
    }
  }, [lessonId]);

  if (!lesson) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Урок не знайдено</h1>
        <p className="text-neutral-400 text-sm">Цей урок не існує або був переміщений.</p>
        <Link
          href="/roadmap"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ios-blue text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Повернутися до програми</span>
        </Link>
      </div>
    );
  }

  const prevLesson = lessonIndex > 0 ? LESSONS[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < LESSONS.length - 1 ? LESSONS[lessonIndex + 1] : null;

  const handleComplete = () => {
    markLessonCompleted(lesson.id, 25);
    setIsCompleted(true);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/roadmap"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Назад до дорожньої карти</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-ios-blue uppercase tracking-wider">
            {lesson.moduleTitle}
          </span>
          <span className="text-neutral-600">•</span>
          <span className="text-xs text-neutral-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {lesson.estimatedMinutes} хв
          </span>
          <span className="text-neutral-600">•</span>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              lesson.difficulty === 'Початковий'
                ? 'bg-blue-500/10 text-blue-400'
                : lesson.difficulty === 'Середній'
                ? 'bg-orange-500/10 text-orange-400'
                : 'bg-purple-500/10 text-purple-400'
            }`}
          >
            {lesson.difficulty}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          {lesson.title}
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          {lesson.description}
        </p>
      </div>

      {/* Theory Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-ios-blue" />
          <span>Теоретична частина</span>
        </h2>
        <div className="glass-panel p-6 rounded-2xl space-y-3 border border-white/10 text-neutral-300 text-sm leading-relaxed">
          {lesson.content.theory.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      {/* Code Snippet */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Зразок коду на Swift</span>
          </h2>
          <span className="text-xs text-neutral-500">Готово для вставки в Xcode</span>
        </div>

        <CodeBlock code={lesson.content.codeSnippet} filename={`${lesson.id}.swift`} />
      </div>

      {/* Code Explanation */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Як це працює під капотом?</h2>
        <div className="space-y-2 text-sm text-neutral-300">
          {lesson.content.explanation.map((item, i) => (
            <div key={i} className="flex items-start gap-3 glass-card p-3.5 rounded-xl">
              <span className="w-5 h-5 rounded-full bg-ios-blue/20 text-ios-blue font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="flex-1 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Takeaways & Common Mistakes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Takeaways */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Головні висновки</span>
          </h3>
          <ul className="space-y-2 text-xs text-neutral-300">
            {lesson.content.keyTakeaways.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Common Mistakes */}
        {lesson.content.commonMistakes && (
          <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 bg-amber-950/10 space-y-3">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Типові помилки початківців</span>
            </h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              {lesson.content.commonMistakes.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 font-bold">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mini Practical Challenge */}
      {lesson.content.challenge && (
        <div className="glass-panel p-6 rounded-2xl border border-ios-blue/30 space-y-4">
          <div className="flex items-center gap-2 text-ios-blue text-sm font-bold">
            <Lightbulb className="w-5 h-5" />
            <span>Практичне мікро-завдання</span>
          </div>

          <p className="text-sm text-neutral-200 font-medium">
            {lesson.content.challenge.task}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium border border-white/10"
            >
              {showHint ? 'Сховати підказку' : 'Показати підказку'}
            </button>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="px-3 py-1.5 rounded-lg bg-ios-blue/20 text-ios-blue hover:bg-ios-blue/30 text-xs font-medium border border-ios-blue/30"
            >
              {showSolution ? 'Сховати розвʼязок' : 'Показати розвʼязок'}
            </button>
          </div>

          {showHint && (
            <div className="p-3 bg-neutral-900 rounded-xl text-xs text-neutral-400 border border-white/5">
              💡 <strong>Підказка:</strong> {lesson.content.challenge.hint}
            </div>
          )}

          {showSolution && (
            <div className="pt-2">
              <CodeBlock code={lesson.content.challenge.solution} filename="Solution.swift" />
            </div>
          )}
        </div>
      )}

      {/* Completion Action */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-white">
            {isCompleted ? 'Урок успішно пройдено!' : 'Закінчили вивчення матеріалу?'}
          </h4>
          <p className="text-xs text-neutral-400">
            {isCompleted
              ? 'Ви заробили +25 XP за цей урок.'
              : 'Натисніть кнопку, щоб зафіксувати прогрес та отримати 25 XP.'}
          </p>
        </div>

        <button
          onClick={handleComplete}
          disabled={isCompleted}
          className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
            isCompleted
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 active:scale-95'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isCompleted ? 'Урок завершено' : 'Відзначити як завершений (+25 XP)'}</span>
        </button>
      </div>

      {/* Pagination Navigation */}
      <div className="pt-8 border-t border-white/10 flex items-center justify-between gap-4">
        {prevLesson ? (
          <Link
            href={`/lessons/${prevLesson.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-white/10 hover:border-white/20 text-xs text-neutral-300 hover:text-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <div className="text-left">
              <span className="block text-[10px] text-neutral-500">Попередній</span>
              <span className="font-semibold truncate max-w-[150px] sm:max-w-xs block">
                {prevLesson.title}
              </span>
            </div>
          </Link>
        ) : (
          <div></div>
        )}

        {nextLesson ? (
          <Link
            href={`/lessons/${nextLesson.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ios-blue text-white hover:bg-blue-600 text-xs font-semibold transition-all shadow-lg shadow-ios-blue/20"
          >
            <div className="text-right">
              <span className="block text-[10px] text-white/70">Наступний</span>
              <span className="font-semibold truncate max-w-[150px] sm:max-w-xs block">
                {nextLesson.title}
              </span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href="/roadmap"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold"
          >
            <span>Всі уроки пройдено!</span>
            <Award className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

