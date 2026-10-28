'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
  Check,
  Circle,
  Award
} from 'lucide-react';
import { LESSONS } from '@/data/lessons';
import { getUserProgress, UserProgress } from '@/lib/storage';

export default function RoadmapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(getUserProgress());
  }, []);

  const completedIds = progress?.completedLessons || [];

  const filteredLessons = LESSONS.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff =
      selectedDifficulty === 'all' || lesson.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  // Group by module
  const modulesMap = filteredLessons.reduce((acc, lesson) => {
    if (!acc[lesson.moduleTitle]) {
      acc[lesson.moduleTitle] = [];
    }
    acc[lesson.moduleTitle].push(lesson);
    return acc;
  }, {} as Record<string, typeof LESSONS>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ios-blue/10 border border-ios-blue/20 text-ios-blue text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Повна навчальна програма</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Дорожня карта iOS Розробника
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          Структурований план навчання від базових типів Swift до повноцінного створення додатків на SwiftUI та публікації в App Store. Проходьте уроки послідовно та відзначайте свій прогрес.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Пошук теми, Swift, @State..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-ios-blue"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'Початковий', 'Середній', 'Просунутий'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                selectedDifficulty === diff
                  ? 'bg-ios-blue text-white shadow'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              {diff === 'all' ? 'Всі рівні' : diff}
            </button>
          ))}
        </div>
      </div>

      {/* Module List */}
      <div className="space-y-12">
        {Object.entries(modulesMap).map(([moduleTitle, lessons]) => {
          const completedInModule = lessons.filter((l) => completedIds.includes(l.id)).length;
          const isModuleFullyComplete = completedInModule === lessons.length && lessons.length > 0;

          return (
            <div key={moduleTitle} className="space-y-4">
              {/* Module Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isModuleFullyComplete
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-ios-blue/20 text-ios-blue border border-ios-blue/30'
                    }`}
                  >
                    {isModuleFullyComplete ? <Check className="w-4 h-4" /> : '★'}
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">{moduleTitle}</h2>
                </div>

                <span className="text-xs text-neutral-400">
                  {completedInModule}/{lessons.length} завершено
                </span>
              </div>

              {/* Lesson Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessons.map((lesson) => {
                  const isDone = completedIds.includes(lesson.id);

                  return (
                    <Link
                      key={lesson.id}
                      href={`/lessons/${lesson.id}`}
                      className={`glass-card p-5 rounded-2xl border transition-all flex flex-col justify-between group hover:scale-[1.01] ${
                        isDone
                          ? 'border-emerald-500/30 bg-emerald-950/10'
                          : 'border-white/10 hover:border-ios-blue/40'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              lesson.difficulty === 'Початковий'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : lesson.difficulty === 'Середній'
                                ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            }`}
                          >
                            {lesson.difficulty}
                          </span>

                          <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                            <Clock className="w-3 h-3" />
                            <span>{lesson.estimatedMinutes} хв</span>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-ios-blue transition-colors flex items-center gap-2">
                            <span>{lesson.title}</span>
                          </h3>
                          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                            {lesson.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        {isDone ? (
                          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Пройдено (+25 XP)</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-neutral-500 group-hover:text-neutral-300">
                            <Circle className="w-3.5 h-3.5" />
                            <span>Не розпочато</span>
                          </span>
                        )}

                        <span className="text-ios-blue font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Відкрити урок</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

