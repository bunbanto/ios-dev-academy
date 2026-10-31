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
  Award,
  Info,
  Cpu,
  Compass,
  Laptop,
  Flame,
  ThumbsDown,
  ThumbsUp,
  Bookmark,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LESSONS } from '@/data/lessons/index';
import CodeBlock from '@/components/CodeBlock';
import { getUserProgress, markLessonCompleted, toggleBookmark, UserProgress } from '@/lib/storage';

export default function LessonDetailPage() {
  const params = useParams();
  const lessonId = params?.id as string;
  const lessonIndex = LESSONS.findIndex((l) => l.id === lessonId);

  const [isCompleted, setIsCompleted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [comparisonTab, setComparisonTab] = useState<'good' | 'bad'>('good');
  
  // Checkpoints interactive state: map of checkpoint index -> selected option index
  const [checkpointAnswers, setCheckpointAnswers] = useState<Record<number, number>>({});

  const lesson = LESSONS[lessonIndex];

  useEffect(() => {
    if (lessonId) {
      const progress = getUserProgress();
      setIsCompleted(progress.completedLessons.includes(lessonId));
      setIsBookmarked(progress.bookmarks?.includes(lessonId) || false);
      setShowHint(false);
      setShowSolution(false);
      setCheckpointAnswers({});
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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleBookmark = () => {
    const updated = toggleBookmark(lesson.id);
    setIsBookmarked(updated);
  };

  const handleSelectCheckpoint = (qIndex: number, optionIndex: number) => {
    setCheckpointAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex,
    }));
  };

  const totalCheckpoints = lesson.content.checkpoints?.length || 0;
  const answeredCheckpointsCount = Object.keys(checkpointAnswers).length;
  const correctCheckpointsCount = lesson.content.checkpoints?.filter(
    (cp, idx) => checkpointAnswers[idx] === cp.correctAnswer
  ).length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/roadmap"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Назад до дорожньої карти</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-xl border text-xs transition-all flex items-center gap-1.5 ${
              isBookmarked
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
            }`}
            title={isBookmarked ? 'В закладках' : 'Зберегти в закладки'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
            <span className="hidden sm:inline">{isBookmarked ? 'Збережено' : 'Зберегти'}</span>
          </button>
        </div>
      </div>

      {/* Lesson Header */}
      <div className="space-y-4 pb-6 border-b border-white/10">
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
            className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
              lesson.difficulty === 'Початковий'
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : lesson.difficulty === 'Середній'
                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
            }`}
          >
            {lesson.difficulty}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          {lesson.title}
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          {lesson.description}
        </p>
      </div>

      {/* Real-World Context Section */}
      {lesson.content.realWorldContext && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-ios-blue/15 via-blue-900/10 to-transparent border border-ios-blue/30 space-y-2">
          <div className="flex items-center gap-2 text-ios-blue text-xs font-bold tracking-wide uppercase">
            <Compass className="w-4 h-4" />
            <span>Реальний контекст в iOS індустрії</span>
          </div>
          <p className="text-sm text-neutral-200 leading-relaxed font-normal">
            {lesson.content.realWorldContext}
          </p>
        </div>
      )}

      {/* Detailed Theory Sections */}
      {lesson.content.detailedTheory && lesson.content.detailedTheory.length > 0 ? (
        <div className="space-y-8">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-5 h-5 text-ios-blue" />
            <h2 className="text-xl font-bold tracking-tight">Поглиблений теоретичний матеріал</h2>
          </div>

          <div className="space-y-6">
            {lesson.content.detailedTheory.map((section, sIdx) => (
              <div
                key={sIdx}
                className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4"
              >
                <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-ios-blue/20 text-ios-blue text-xs font-bold flex items-center justify-center">
                    {sIdx + 1}
                  </span>
                  <span>{section.title}</span>
                </h3>

                <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>

                {section.callout && (
                  <div
                    className={`p-4 rounded-xl text-xs space-y-1.5 border ${
                      section.callout.type === 'tip'
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : section.callout.type === 'warning'
                        ? 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                        : 'bg-blue-950/20 border-blue-500/30 text-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px]">
                      {section.callout.type === 'tip' && <Lightbulb className="w-4 h-4 text-emerald-400" />}
                      {section.callout.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      {section.callout.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
                      <span>{section.callout.title || (section.callout.type === 'tip' ? 'Порада від Senior iOS' : section.callout.type === 'warning' ? 'Важливе застереження' : 'Зверніть увагу')}</span>
                    </div>
                    <p className="leading-relaxed text-neutral-200">{section.callout.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Fallback Theory */
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
      )}

      {/* Code Comparison (Bad vs Good practice) */}
      {lesson.content.comparisonSnippet && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Практика коду: Як треба і як НЕ треба</span>
            </h2>

            {/* Toggle Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-neutral-900 border border-white/10">
              <button
                onClick={() => setComparisonTab('good')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  comparisonTab === 'good'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Ідіоматичний Swift</span>
              </button>
              <button
                onClick={() => setComparisonTab('bad')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  comparisonTab === 'bad'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>Типова помилка</span>
              </button>
            </div>
          </div>

          {comparisonTab === 'good' ? (
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 font-medium">
                ✅ <strong>Правильно ({lesson.content.comparisonSnippet.good.title}):</strong>{' '}
                {lesson.content.comparisonSnippet.good.explanation}
              </div>
              <CodeBlock
                code={lesson.content.comparisonSnippet.good.code}
                filename="BestPractice.swift"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 text-xs text-red-300 font-medium">
                ❌ <strong>Антипатерн ({lesson.content.comparisonSnippet.bad.title}):</strong>{' '}
                {lesson.content.comparisonSnippet.bad.explanation}
              </div>
              <CodeBlock
                code={lesson.content.comparisonSnippet.bad.code}
                filename="AntiPattern.swift"
              />
            </div>
          )}
        </div>
      )}

      {/* Main Code Snippet */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Повний зразок коду на Swift</span>
          </h2>
          <span className="text-xs text-neutral-500">Готово для вставки в Xcode</span>
        </div>

        <CodeBlock code={lesson.content.codeSnippet} filename={`${lesson.id}.swift`} />
      </div>

      {/* Step-by-Step Code Explanation */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Як цей код працює крок за кроком</h2>
        <div className="space-y-2 text-sm text-neutral-300">
          {lesson.content.explanation.map((item, i) => (
            <div key={i} className="flex items-start gap-3 glass-card p-3.5 rounded-xl border border-white/5">
              <span className="w-5 h-5 rounded-full bg-ios-blue/20 text-ios-blue font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="flex-1 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Under The Hood / Deep Dive Card */}
      {lesson.content.underTheHood && (
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-950/15 via-transparent to-transparent space-y-4">
          <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-base">
            <Cpu className="w-5 h-5" />
            <span>Під капотом: {lesson.content.underTheHood.title}</span>
          </div>

          <div className="space-y-2.5 text-xs text-neutral-300">
            {lesson.content.underTheHood.points.map((pt, pIdx) => (
              <div key={pIdx} className="flex items-start gap-2.5">
                <span className="text-cyan-400 mt-0.5">•</span>
                <p className="leading-relaxed flex-1">{pt}</p>
              </div>
            ))}
          </div>

          {lesson.content.underTheHood.note && (
            <div className="pt-2 border-t border-cyan-500/10 text-xs text-neutral-400 italic">
              📌 {lesson.content.underTheHood.note}
            </div>
          )}
        </div>
      )}

      {/* Interactive Checkpoints (Mini-Quiz inside the lesson) */}
      {lesson.content.checkpoints && lesson.content.checkpoints.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <HelpCircle className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold">Експрес-перевірка знань</h2>
            </div>
            {answeredCheckpointsCount > 0 && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Результат: {correctCheckpointsCount}/{totalCheckpoints} правильно
              </span>
            )}
          </div>

          <div className="space-y-4">
            {lesson.content.checkpoints.map((cp, qIdx) => {
              const selectedAnswer = checkpointAnswers[qIdx];
              const isAnswered = selectedAnswer !== undefined;
              const isCorrect = isAnswered && selectedAnswer === cp.correctAnswer;

              return (
                <div
                  key={qIdx}
                  className="glass-panel p-5 rounded-2xl border border-white/10 space-y-4"
                >
                  <p className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 text-xs flex items-center justify-center font-bold">
                      {qIdx + 1}
                    </span>
                    <span>{cp.question}</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {cp.options.map((opt, optIdx) => {
                      const isThisSelected = selectedAnswer === optIdx;
                      const isThisCorrectAnswer = optIdx === cp.correctAnswer;

                      let btnStyle =
                        'bg-neutral-900 border-white/10 text-neutral-300 hover:border-purple-500/40 hover:text-white';

                      if (isAnswered) {
                        if (isThisCorrectAnswer) {
                          btnStyle =
                            'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-semibold';
                        } else if (isThisSelected && !isCorrect) {
                          btnStyle =
                            'bg-red-500/20 border-red-500/50 text-red-300 font-medium';
                        } else {
                          btnStyle = 'opacity-40 bg-neutral-900 border-white/5 text-neutral-500';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectCheckpoint(qIdx, optIdx)}
                          className={`p-3 text-left rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && isThisCorrectAnswer && (
                            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div
                      className={`p-3 rounded-xl text-xs space-y-1 ${
                        isCorrect
                          ? 'bg-emerald-950/20 border border-emerald-500/30 text-emerald-300'
                          : 'bg-amber-950/20 border border-amber-500/30 text-amber-300'
                      }`}
                    >
                      <p className="font-semibold">
                        {isCorrect ? '🎉 Чудово! Відповідь точна.' : '💡 Не зовсім так:'}
                      </p>
                      <p className="text-neutral-200">{cp.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Key Takeaways & Common Mistakes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Takeaways */}
        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Головні висновки уроку</span>
          </h3>
          <ul className="space-y-2 text-xs text-neutral-300">
            {lesson.content.keyTakeaways.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
                <span className="leading-relaxed">{item}</span>
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
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Xcode Lab Section (if available) */}
      {lesson.content.xcodeLab && (
        <div className="glass-panel p-6 rounded-2xl border border-ios-blue/40 bg-blue-950/10 space-y-4">
          <div className="flex items-center gap-2 text-ios-blue text-sm font-bold">
            <Laptop className="w-5 h-5" />
            <span>Лабораторна робота в Xcode: {lesson.content.xcodeLab.task}</span>
          </div>

          <div className="space-y-2 text-xs text-neutral-300">
            <h4 className="font-semibold text-white">Покрокова інструкція:</h4>
            {lesson.content.xcodeLab.steps.map((st, sIdx) => (
              <div key={sIdx} className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-full bg-ios-blue/20 text-ios-blue font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {sIdx + 1}
                </span>
                <p className="leading-relaxed">{st}</p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <CodeBlock code={lesson.content.xcodeLab.code} filename="XcodeLab.swift" />
          </div>

          {lesson.content.xcodeLab.expectedOutput && (
            <div className="p-3 bg-neutral-900 rounded-xl text-xs text-neutral-300 border border-white/5 font-mono">
              <span className="text-neutral-500 block mb-1">Очікуваний вивід у консолі Xcode:</span>
              <span className="text-emerald-400">{lesson.content.xcodeLab.expectedOutput}</span>
            </div>
          )}

          {lesson.content.xcodeLab.tips && (
            <p className="text-xs text-neutral-400 italic">
              💡 Порада: {lesson.content.xcodeLab.tips}
            </p>
          )}
        </div>
      )}

      {/* Mini Practical Challenge */}
      {lesson.content.challenge && (
        <div className="glass-panel p-6 rounded-2xl border border-ios-blue/30 space-y-4">
          <div className="flex items-center gap-2 text-ios-blue text-sm font-bold">
            <Lightbulb className="w-5 h-5" />
            <span>Практичне мікро-завдання</span>
          </div>

          <p className="text-sm text-neutral-200 font-medium leading-relaxed">
            {lesson.content.challenge.task}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3.5 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium border border-white/10 transition-colors"
            >
              {showHint ? 'Сховати підказку' : 'Показати підказку'}
            </button>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="px-3.5 py-1.5 rounded-lg bg-ios-blue/20 text-ios-blue hover:bg-ios-blue/30 text-xs font-medium border border-ios-blue/30 transition-colors"
            >
              {showSolution ? 'Сховати розвʼязок' : 'Показати розвʼязок'}
            </button>
          </div>

          {showHint && (
            <div className="p-3.5 bg-neutral-900 rounded-xl text-xs text-neutral-300 border border-white/5">
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
      <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-neutral-900">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Урок успішно пройдено!</span>
              </>
            ) : (
              <>
                <Flame className="w-5 h-5 text-orange-400" />
                <span>Закінчили вивчення матеріалу?</span>
              </>
            )}
          </h4>
          <p className="text-xs text-neutral-400">
            {isCompleted
              ? 'Ви заробили +25 XP за цей урок. Продовжуйте до наступної теми!'
              : 'Натисніть кнопку нижче, щоб зафіксувати прогрес та отримати +25 XP.'}
          </p>
        </div>

        <button
          onClick={handleComplete}
          disabled={isCompleted}
          className={`px-6 py-3.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg whitespace-nowrap ${
            isCompleted
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 active:scale-95'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isCompleted ? 'Урок пройдено' : 'Відзначити як завершений (+25 XP)'}</span>
        </button>
      </div>

      {/* Pagination Navigation */}
      <div className="pt-8 border-t border-white/10 flex items-center justify-between gap-4">
        {prevLesson ? (
          <Link
            href={`/lessons/${prevLesson.id}`}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 hover:border-white/20 text-xs text-neutral-300 hover:text-white transition-all max-w-[48%]"
          >
            <ChevronLeft className="w-4 h-4 flex-shrink-0" />
            <div className="text-left truncate">
              <span className="block text-[10px] text-neutral-500">Попередній урок</span>
              <span className="font-semibold truncate block">
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
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-ios-blue text-white hover:bg-blue-600 text-xs font-semibold transition-all shadow-lg shadow-ios-blue/20 max-w-[48%]"
          >
            <div className="text-right truncate">
              <span className="block text-[10px] text-white/70">Наступний урок</span>
              <span className="font-semibold truncate block">
                {nextLesson.title}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          </Link>
        ) : (
          <Link
            href="/roadmap"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
          >
            <span>Всі уроки курсу пройдено!</span>
            <Award className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
