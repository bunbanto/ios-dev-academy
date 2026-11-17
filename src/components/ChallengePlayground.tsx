'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Code2,
  Lightbulb,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Wand2,
  AlertTriangle,
  LockKeyhole,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import CodeBlock from '@/components/CodeBlock';
import { useAuth } from '@/context/AuthContext';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { syncUserToRegistry } from '@/lib/access';
import { getUserProgress, markChallengeCompleted } from '@/lib/storage';
import {
  buildDefaultStarterCode,
  runLocalChallengePrecheck,
} from '@/lib/challenge-precheck';
import { t } from '@/i18n/ui';
import type { ChallengeReviewResult, GeneratedPracticeTask } from '@/types';

interface LessonChallengeData {
  task: string;
  hint: string;
  solution: string;
  starterCode?: string;
}

interface ChallengePlaygroundProps {
  lessonId: string;
  pageId?: string;
  challenge: LessonChallengeData;
  locale: 'uk' | 'en';
  onProgressUpdated?: () => void;
}

export default function ChallengePlayground({
  lessonId,
  pageId,
  challenge,
  locale,
  onProgressUpdated,
}: ChallengePlaygroundProps) {
  const { user, isAdmin, openAuthModal } = useAuth();
  const mainChallengeKey = lessonId;
  const legacyChallengeKey = pageId ? `${lessonId}:${pageId}` : lessonId;
  const draftStorageKey = `swiftlab_challenge_draft_v1_${lessonId}`;
  const defaultStarter = useMemo(
    () => challenge.starterCode || buildDefaultStarterCode(locale),
    [challenge.starterCode, locale],
  );

  const [mode, setMode] = useState<'main' | 'generated'>('main');
  const [generatedTask, setGeneratedTask] = useState<GeneratedPracticeTask | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const [code, setCode] = useState<string>(defaultStarter);
  const [isChecking, setIsChecking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reviewResult, setReviewResult] = useState<ChallengeReviewResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [solvedKeys, setSolvedKeys] = useState<string[]>([]);

  const [quotaInfo, setQuotaInfo] = useState<{
    configured: boolean;
    remainingQuota: number;
    dailyLimit: number;
  } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeTaskKey =
    mode === 'generated' && generatedTask
      ? `generated:${generatedTask.id}`
      : mainChallengeKey;
  const activeTaskText =
    mode === 'generated' && generatedTask ? generatedTask.task : challenge.task;
  const activeHintText =
    mode === 'generated' && generatedTask ? generatedTask.hint : challenge.hint;
  const activeStarter =
    mode === 'generated' && generatedTask
      ? generatedTask.starterCode || buildDefaultStarterCode(locale)
      : defaultStarter;
  const isCurrentSolved =
    mode === 'generated'
      ? solvedKeys.includes(activeTaskKey)
      : solvedKeys.includes(mainChallengeKey) ||
        solvedKeys.includes(legacyChallengeKey);

  // Sync solved state and restore saved draft ONLY when switching lessons
  useEffect(() => {
    const progress = getUserProgress();
    setSolvedKeys(progress.completedChallenges || []);
    setMode('main');
    setGeneratedTask(null);
    setReviewResult(null);
    setApiError(null);
    setShowHint(false);
    setShowSolution(false);

    try {
      const savedDraft =
        localStorage.getItem(draftStorageKey) ||
        localStorage.getItem(`swiftlab_challenge_draft_v1_${legacyChallengeKey}`);
      if (savedDraft && savedDraft.trim().length > 0) {
        setCode(savedDraft);
      } else {
        setCode(challenge.starterCode || buildDefaultStarterCode(locale));
      }
    } catch {
      setCode(challenge.starterCode || buildDefaultStarterCode(locale));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  // When switching UI language inside the same lesson, preserve student code;
  // only swap the default untouched starter comment to the new language.
  useEffect(() => {
    if (mode !== 'main' || challenge.starterCode) return;
    const ukDefault = buildDefaultStarterCode('uk');
    const enDefault = buildDefaultStarterCode('en');
    setCode((prev) => {
      if (prev === ukDefault || prev === enDefault) {
        return buildDefaultStarterCode(locale);
      }
      return prev;
    });
  }, [locale, mode, challenge.starterCode]);

  // Persist draft for the main challenge
  useEffect(() => {
    if (mode !== 'main') return;
    try {
      localStorage.setItem(draftStorageKey, code);
    } catch {
      // Ignore storage quota errors
    }
  }, [code, draftStorageKey, mode]);

  // Keep solved badge in sync when cloud progress arrives from another device
  useEffect(() => {
    const syncSolved = () => {
      const progress = getUserProgress();
      setSolvedKeys(progress.completedChallenges || []);
    };
    window.addEventListener('storage', syncSolved);
    window.addEventListener('swiftlab_progress_change', syncSolved);
    return () => {
      window.removeEventListener('storage', syncSolved);
      window.removeEventListener('swiftlab_progress_change', syncSolved);
    };
  }, []);

  // Fetch daily AI quota status when authenticated (or local dev without Firebase)
  useEffect(() => {
    let active = true;
    const fetchQuota = async () => {
      if (isFirebaseConfigured && (!user || !auth.currentUser)) {
        if (active) setQuotaInfo(null);
        return;
      }
      try {
        const headers: Record<string, string> = {};
        if (isFirebaseConfigured && auth.currentUser) {
          const token = await auth.currentUser.getIdToken();
          headers.Authorization = `Bearer ${token}`;
        }
        const res = await fetch('/api/check-challenge', { headers });
        if (!res.ok) return;
        const data = (await res.json()) as {
          configured: boolean;
          remainingQuota: number;
          dailyLimit: number;
        };
        if (active) setQuotaInfo(data);
      } catch {
        // Non-blocking status check
      }
    };

    void fetchQuota();
    return () => {
      active = false;
    };
  }, [user]);

  const recordSuccessIfPassed = (result: ChallengeReviewResult) => {
    if (!result.passed) return;
    const reward = mode === 'generated' ? 15 : 20;
    const wasAlreadySolved = isCurrentSolved;
    const updatedProgress = wasAlreadySolved
      ? getUserProgress()
      : markChallengeCompleted(activeTaskKey, reward);
    setSolvedKeys(updatedProgress.completedChallenges || []);
    if (onProgressUpdated) onProgressUpdated();
    if (user && !wasAlreadySolved) {
      void syncUserToRegistry(user, updatedProgress);
    }
    if (!wasAlreadySolved) {
      try {
        confetti({
          particleCount: 70,
          spread: 65,
          origin: { y: 0.78 },
        });
      } catch {
        // Safe fallback
      }
    }
  };

  const handleCheckCode = async () => {
    setApiError(null);

    // 1. Instant local pre-check before touching network or requiring token
    const localPrecheck = runLocalChallengePrecheck({
      userCode: code,
      starterCode: activeStarter,
      referenceSolution: mode === 'main' ? challenge.solution : undefined,
      locale,
    });

    if (localPrecheck) {
      setReviewResult(localPrecheck);
      recordSuccessIfPassed(localPrecheck);
      return;
    }

    // 2. Require sign-in when Firebase Auth is active
    if (isFirebaseConfigured && (!user || !auth.currentUser)) {
      setApiError(
        locale === 'en'
          ? 'Sign in with Google or Email to run AI code verification.'
          : 'Увійдіть через Google або Email, щоб перевіряти код за допомогою AI.',
      );
      openAuthModal('login');
      return;
    }

    setIsChecking(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (isFirebaseConfigured && auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch('/api/check-challenge', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          lessonId,
          pageId,
          userCode: code,
          locale,
          generatedTask: mode === 'generated' ? generatedTask : undefined,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        if (typeof payload.remainingQuota === 'number' && typeof payload.dailyLimit === 'number') {
          setQuotaInfo((prev) => ({
            configured: prev?.configured ?? true,
            remainingQuota: payload.remainingQuota,
            dailyLimit: payload.dailyLimit,
          }));
        }
        throw new Error(
          payload.error ||
            (locale === 'en'
              ? 'Could not verify code right now.'
              : 'Не вдалося перевірити код зараз.'),
        );
      }

      const result = payload as ChallengeReviewResult;
      setReviewResult(result);
      if (typeof result.remainingQuota === 'number' && typeof result.dailyLimit === 'number') {
        setQuotaInfo({
          configured: true,
          remainingQuota: result.remainingQuota,
          dailyLimit: result.dailyLimit,
        });
      }
      recordSuccessIfPassed(result);
    } catch (error: any) {
      setApiError(
        error?.message ||
          (locale === 'en' ? 'Verification failed.' : 'Помилка перевірки.'),
      );
    } finally {
      setIsChecking(false);
    }
  };

  const handleGeneratePractice = async () => {
    setApiError(null);

    if (isFirebaseConfigured && (!user || !auth.currentUser)) {
      setApiError(
        locale === 'en'
          ? 'Sign in to generate new AI practice exercises.'
          : 'Увійдіть в акаунт, щоб генерувати нові практичні завдання з AI.',
      );
      openAuthModal('login');
      return;
    }

    setIsGenerating(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (isFirebaseConfigured && auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch('/api/generate-practice', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          lessonId,
          difficulty,
          locale,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(
          payload.error ||
            (locale === 'en'
              ? 'Could not generate a practice task.'
              : 'Не вдалося згенерувати нове завдання.'),
        );
      }

      const nextTask = payload.task as GeneratedPracticeTask;
      setGeneratedTask(nextTask);
      setMode('generated');
      setCode(nextTask.starterCode || buildDefaultStarterCode(locale));
      setReviewResult(null);
      setShowHint(false);
      setShowSolution(false);

      if (typeof payload.remainingQuota === 'number' && typeof payload.dailyLimit === 'number') {
        setQuotaInfo({
          configured: true,
          remainingQuota: payload.remainingQuota,
          dailyLimit: payload.dailyLimit,
        });
      }
    } catch (error: any) {
      setApiError(
        error?.message ||
          (locale === 'en' ? 'Generation failed.' : 'Не вдалося згенерувати задачу.'),
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const updated = code.slice(0, start) + '    ' + code.slice(end);
      setCode(updated);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 4;
          textareaRef.current.selectionEnd = start + 4;
        }
      });
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isChecking) {
        void handleCheckCode();
      }
    }
  };

  const lineCount = Math.max(8, code.split('\n').length);

  return (
    <div
      id="challenge"
      className="glass-panel p-5 sm:p-6 rounded-2xl border border-ios-blue/30 space-y-5 scroll-mt-24"
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-ios-blue text-sm font-bold">
            <Lightbulb className="w-5 h-5" />
            <span>
              {mode === 'generated' && generatedTask
                ? generatedTask.title
                : t('Практичне мікрозавдання', locale)}
            </span>
          </div>

          {isCurrentSolved && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {locale === 'en'
                  ? `Solved (+${mode === 'generated' ? 15 : 20} XP)`
                  : `Виконано (+${mode === 'generated' ? 15 : 20} XP)`}
              </span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {quotaInfo && (
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                quotaInfo.configured
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
              title={
                locale === 'en'
                  ? 'Local pre-checks and cached answers do not use your daily AI quota.'
                  : 'Локальні пре-чеки та кешовані відповіді не витрачають вашу денну квоту.'
              }
            >
              <Sparkles className="w-3 h-3" />
              {quotaInfo.configured ? (
                <span>
                  {locale === 'en'
                    ? `AI checks: ${quotaInfo.remainingQuota}/${quotaInfo.dailyLimit}`
                    : `AI-перевірок: ${quotaInfo.remainingQuota}/${quotaInfo.dailyLimit}`}
                  {isAdmin ? (locale === 'en' ? ' (Admin)' : ' (Адмін)') : ''}
                </span>
              ) : (
                <span>
                  {locale === 'en'
                    ? 'AI key not set on server'
                    : 'GEMINI_API_KEY ще не додано'}
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      {/* Mode Switcher if an AI-generated practice task exists */}
      {generatedTask && (
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-neutral-900/80 border border-white/10 w-fit">
          <button
            type="button"
            onClick={() => {
              setMode('main');
              setReviewResult(null);
              setApiError(null);
              setShowHint(false);
              setShowSolution(false);
              try {
                const savedDraft = localStorage.getItem(draftStorageKey);
                setCode(savedDraft || defaultStarter);
              } catch {
                setCode(defaultStarter);
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'main'
                ? 'bg-ios-blue text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {locale === 'en' ? 'Main lesson task' : 'Основне завдання'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('generated');
              setReviewResult(null);
              setApiError(null);
              setShowHint(false);
              setShowSolution(false);
              setCode(generatedTask.starterCode || buildDefaultStarterCode(locale));
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              mode === 'generated'
                ? 'bg-purple-600 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>
              {locale === 'en' ? 'AI Bonus Task' : 'Бонусна AI-задача'}
            </span>
          </button>
        </div>
      )}

      {/* Task Prompt */}
      <div className="space-y-2">
        <p className="text-sm text-neutral-200 font-medium leading-relaxed">
          {activeTaskText}
        </p>

        {mode === 'generated' &&
          generatedTask &&
          generatedTask.expectedCriteria.length > 0 && (
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
                {locale === 'en' ? 'Acceptance criteria:' : 'Критерії перевірки:'}
              </p>
              <ul className="space-y-1 text-xs text-neutral-300">
                {generatedTask.expectedCriteria.map((criterion, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400">•</span>
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>

      {/* Interactive Swift Code Editor */}
      <div className="code-editor-dark rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-[#0d1117]">
        <div className="px-4 py-2.5 bg-[#161b22] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <Code2 className="w-3.5 h-3.5 text-ios-blue ml-1" />
            <span className="text-xs font-mono text-neutral-300">
              Challenge.swift
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-neutral-400">
            <span className="hidden sm:inline">Cmd/Ctrl + Enter</span>
            <button
              type="button"
              onClick={() => {
                setCode(activeStarter);
                setReviewResult(null);
                setApiError(null);
              }}
              className="inline-flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{locale === 'en' ? 'Reset' : 'Скинути'}</span>
            </button>
          </div>
        </div>

        <div className="flex font-mono text-xs sm:text-[13px] leading-6">
          <div
            aria-hidden="true"
            className="select-none py-3.5 px-3 text-right text-neutral-600 bg-[#0b0f15] border-r border-white/5 min-w-[2.5rem]"
          >
            {Array.from({ length: lineCount }, (_, idx) => (
              <div key={idx}>{idx + 1}</div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleEditorKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            rows={Math.min(18, Math.max(8, lineCount))}
            aria-label={
              locale === 'en' ? 'Swift solution editor' : 'Редактор коду Swift'
            }
            className="code-editor-dark w-full p-3.5 bg-[#0d1117] text-neutral-100 placeholder-neutral-600 focus:outline-none resize-y font-mono leading-6"
          />
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={isChecking}
            onClick={() => void handleCheckCode()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-ios-blue to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs font-bold shadow-lg shadow-ios-blue/25 transition-all flex items-center gap-2 disabled:opacity-60 active:scale-95"
          >
            {isChecking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span>
              {isChecking
                ? locale === 'en'
                  ? 'Reviewing with AI…'
                  : 'AI перевіряє код…'
                : locale === 'en'
                ? 'Check with AI'
                : 'Перевірити з AI'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium border border-white/10 transition-colors"
          >
            {showHint ? t('Сховати підказку', locale) : t('Показати підказку', locale)}
          </button>

          {mode === 'main' && (
            <button
              type="button"
              onClick={() => setShowSolution(!showSolution)}
              className="px-3.5 py-2 rounded-xl bg-ios-blue/15 text-ios-blue hover:bg-ios-blue/25 text-xs font-medium border border-ios-blue/30 transition-colors"
            >
              {showSolution
                ? t('Сховати розвʼязок', locale)
                : t('Показати розвʼязок', locale)}
            </button>
          )}
        </div>

        {/* Extra AI Practice Generator */}
        <div className="flex items-center gap-2">
          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')
            }
            aria-label={locale === 'en' ? 'Difficulty' : 'Складність'}
            className="px-2.5 py-2 rounded-xl bg-neutral-900 border border-white/10 text-[11px] font-semibold text-neutral-300 focus:outline-none focus:border-purple-500"
          >
            <option value="easy">{locale === 'en' ? 'Easy' : 'Легка'}</option>
            <option value="medium">{locale === 'en' ? 'Medium' : 'Середня'}</option>
            <option value="hard">{locale === 'en' ? 'Hard' : 'Складна'}</option>
          </select>

          <button
            type="button"
            disabled={isGenerating}
            onClick={() => void handleGeneratePractice()}
            className="px-3.5 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Wand2 className="w-3.5 h-3.5" />
            )}
            <span>
              {isGenerating
                ? locale === 'en'
                  ? 'Generating…'
                  : 'Генеруємо…'
                : locale === 'en'
                ? 'New AI Task'
                : 'Ще AI-задача'}
            </span>
          </button>
        </div>
      </div>

      {/* Sign-in Prompt for Unauthenticated Users */}
      {isFirebaseConfigured && !user && (
        <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <LockKeyhole className="w-4 h-4 text-ios-blue shrink-0" />
            <span>
              {locale === 'en'
                ? 'Sign in with Google or Email to unlock free AI code reviews and bonus tasks.'
                : 'Увійдіть через Google або Email, щоб користуватися безкоштовною AI-перевіркою коду та генератором задач.'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="px-3.5 py-1.5 rounded-lg bg-ios-blue hover:bg-blue-600 text-white font-semibold shrink-0 transition-colors"
          >
            {t('Увійти', locale)}
          </button>
        </div>
      )}

      {/* API / Server Error Alert */}
      {apiError && (
        <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{apiError}</span>
        </div>
      )}

      {/* Structured AI Review Feedback */}
      {reviewResult && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border space-y-3 animate-fadeIn ${
            reviewResult.passed
              ? 'bg-emerald-950/20 border-emerald-500/35'
              : 'bg-amber-950/20 border-amber-500/35'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {reviewResult.passed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              )}
              <span
                className={`text-sm font-bold ${
                  reviewResult.passed ? 'text-emerald-300' : 'text-amber-300'
                }`}
              >
                {reviewResult.verdict}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs font-mono font-bold">
                {reviewResult.score}/100
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1">
                {reviewResult.source === 'gemini' ? (
                  <>
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>Gemini AI</span>
                  </>
                ) : reviewResult.source === 'cache' ? (
                  <>
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span>{locale === 'en' ? 'Cached' : 'Кеш'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3 text-ios-blue" />
                    <span>{locale === 'en' ? 'Quick check' : 'Пре-чек'}</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {reviewResult.errors.length > 0 && (
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-red-300">
                {locale === 'en' ? 'What to fix:' : 'Що виправити:'}
              </p>
              <ul className="space-y-1 text-xs text-neutral-200">
                {reviewResult.errors.map((err, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✕</span>
                    <span className="leading-relaxed">{err}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {reviewResult.hints.length > 0 && (
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                {locale === 'en' ? 'Hints:' : 'Підказки:'}
              </p>
              <ul className="space-y-1 text-xs text-neutral-200">
                {reviewResult.hints.map((hint, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">→</span>
                    <span className="leading-relaxed">{hint}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {reviewResult.idiomaticTip && (
            <div className="pt-2 border-t border-white/10 text-xs text-ios-blue flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                <strong>Swift 6 Tip:</strong> {reviewResult.idiomaticTip}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Built-in Hint */}
      {showHint && (
        <div className="p-3.5 bg-neutral-900 rounded-xl text-xs text-neutral-300 border border-white/5">
          💡 <strong>{t('Підказка:', locale)}</strong> {activeHintText}
        </div>
      )}

      {/* Reference Solution */}
      {showSolution && mode === 'main' && (
        <div className="pt-1">
          <CodeBlock code={challenge.solution} filename="Solution.swift" />
        </div>
      )}
    </div>
  );
}
