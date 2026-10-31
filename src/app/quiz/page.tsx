'use client';
import { t } from '@/i18n/ui';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Award,
  Zap,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '@/data/quiz';
import CodeBlock from '@/components/CodeBlock';
import { getUserProgress, saveUserProgress } from '@/lib/storage';
import { useLocale } from '@/i18n/LocaleContext';
import { localizeContent } from '@/i18n/content';

export default function QuizPage() {
  const { locale } = useLocale();
  const questions = localizeContent(QUIZ_QUESTIONS, locale);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      // save progress XP
      const earnedXp = (score + (selectedOption === currentQ.correctAnswer ? 1 : 0)) * 20;
      const progress = getUserProgress();
      progress.totalXp += earnedXp;
      saveUserProgress(progress);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t("Тренажер Співбесіди на iOS", locale)}</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          {t("Тестування знань Swift & SwiftUI", locale)}
        </h1>
        <p className="text-xs text-neutral-400">
          {t("Питання відбираються за стандартами технічних інтервʼю на рівні Junior/Middle iOS Developer.", locale)}
        </p>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-neutral-400 font-medium">
              <span>
                {locale === 'en' ? `Question ${currentIndex + 1} of ${questions.length}` : `Питання ${currentIndex + 1} з ${questions.length}`}
              </span>
              <span>{t("Правильно:", locale)} {score}</span>
            </div>
            <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden border border-white/5">
              <div
                className="bg-ios-blue h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs px-2.5 py-1 rounded-full bg-ios-blue/20 text-ios-blue font-semibold">
                {currentQ.category}
              </span>
              <span className="text-[11px] text-neutral-500 capitalize">
                {t("Рівень:", locale)} {currentQ.difficulty}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {currentQ.question}
            </h2>

            {currentQ.codeSnippet && (
              <CodeBlock code={currentQ.codeSnippet} filename="Snippet.swift" />
            )}

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctAnswer;

                let btnStyle = 'bg-neutral-900 border-white/10 text-neutral-200 hover:border-white/20';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                  } else if (isSelected) {
                    btnStyle = 'bg-red-500/20 border-red-500 text-red-300';
                  } else {
                    btnStyle = 'bg-neutral-900/50 border-white/5 text-neutral-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswered && (
                      <div className="flex-shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-red-400" />
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {isAnswered && (
              <div
                className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 ${
                  selectedOption === currentQ.correctAnswer
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-neutral-900 border-white/10 text-neutral-300'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>{t("Пояснення:", locale)}</span>
                </div>
                <p>{currentQ.explanation}</p>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full py-3.5 rounded-2xl bg-ios-blue hover:bg-blue-600 text-white font-semibold text-xs transition-all shadow-lg shadow-ios-blue/20 flex items-center justify-center gap-2"
              >
                <span>
                  {currentIndex < questions.length - 1 ? (locale === 'en' ? 'Next question' : t("Наступне питання", locale)) : (locale === 'en' ? 'Finish quiz' : t("Завершити тест", locale))}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-yellow-500/20 text-yellow-400 mx-auto flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">{t("Тест успішно завершено!", locale)}</h2>
            <p className="text-xs text-neutral-400 mt-1">
              {t("Ваш підсумковий результат за запитаннями:", locale)}
            </p>
          </div>

          <div className="p-6 bg-neutral-900 rounded-2xl border border-white/10 inline-block min-w-[200px]">
            <span className="text-4xl font-black text-white block">
              {score} / {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-xs text-emerald-400 font-semibold block mt-1">
              {Math.round((score / questions.length) * 100)}% {locale === 'en' ? 'Correct answers' : t("Правильних відповідей", locale)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all border border-white/10"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t("Пройти ще раз", locale)}</span>
            </button>

            <Link
              href="/roadmap"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-ios-blue hover:bg-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-ios-blue/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t("Повернутися до уроків", locale)}</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

