'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  LockKeyhole,
  ChevronDown,
  ChevronRight,
  List,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useLocale } from '@/i18n/LocaleContext';
import { t } from '@/i18n/ui';
import { isModuleUnlocked } from '@/lib/progression';
import { LESSONS } from '@/data/lessons/index';
import type { Lesson } from '@/types';

export interface InPageSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface LessonSidebarProps {
  currentLessonId: string;
  currentLessonModule: number;
  completedLessonIds: string[];
  lessons: Lesson[];
  sections: InPageSection[];
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function LessonSidebar({
  currentLessonId,
  currentLessonModule,
  completedLessonIds,
  lessons,
  sections,
  isMobileOpen,
  onCloseMobile,
}: LessonSidebarProps) {
  const { locale } = useLocale();
  const [activeTab, setActiveTab] = useState<'curriculum' | 'sections'>('curriculum');
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({
    [currentLessonModule]: true,
  });

  // Ensure current lesson's module is expanded when lesson changes
  useEffect(() => {
    setExpandedModules((prev) => ({
      ...prev,
      [currentLessonModule]: true,
    }));
  }, [currentLessonModule]);

  // Group lessons by module
  const moduleGroups = useMemo(() => {
    const map = new Map<number, { moduleNumber: number; moduleTitle: string; lessons: Lesson[] }>();
    lessons.forEach((l) => {
      if (!map.has(l.module)) {
        map.set(l.module, {
          moduleNumber: l.module,
          moduleTitle: l.moduleTitle,
          lessons: [],
        });
      }
      map.get(l.module)!.lessons.push(l);
    });
    return Array.from(map.values()).sort((a, b) => a.moduleNumber - b.moduleNumber);
  }, [lessons]);

  const totalLessons = lessons.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const toggleModule = (moduleNum: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleNum]: !prev[moduleNum],
    }));
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Header & Back Link */}
      <div className="space-y-3 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <Link
            href="/roadmap"
            onClick={isMobileOpen ? onCloseMobile : undefined}
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>{t("Назад до дорожньої карти", locale)}</span>
          </Link>

          {isMobileOpen && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label={t("Закрити меню", locale)}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Course Progress Card */}
        <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-ios-blue" />
              <span>{t("Прогрес курсу", locale)}</span>
            </span>
            <span className="font-bold text-ios-blue">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-ios-blue to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-neutral-400 flex items-center justify-between">
            <span>{completedCount} {t("з", locale)} {totalLessons} {t("уроків", locale)}</span>
            <span className="text-emerald-400 font-medium">+{completedCount * 25} XP</span>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Curriculum vs In this lesson */}
      <div className="flex items-center p-1 rounded-xl bg-neutral-900 border border-white/10 shrink-0">
        <button
          onClick={() => setActiveTab('curriculum')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'curriculum'
              ? 'bg-ios-blue text-white shadow-md shadow-ios-blue/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{locale === 'en' ? 'Curriculum' : 'Уроки курсу'}</span>
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'sections'
              ? 'bg-ios-blue text-white shadow-md shadow-ios-blue/20'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>{locale === 'en' ? 'On this page' : 'У цьому уроці'}</span>
        </button>
      </div>

      {/* Tab 1: Curriculum (All Modules & Lessons) */}
      {activeTab === 'curriculum' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
          {moduleGroups.map((group) => {
            const isUnlocked = isModuleUnlocked(group.moduleNumber, LESSONS, completedLessonIds);
            const isExpanded = !!expandedModules[group.moduleNumber];
            const groupCompletedCount = group.lessons.filter((l) =>
              completedLessonIds.includes(l.id)
            ).length;
            const isGroupAllDone = groupCompletedCount === group.lessons.length;
            const isCurrentModule = group.moduleNumber === currentLessonModule;

            return (
              <div
                key={group.moduleNumber}
                className={`rounded-2xl border transition-all ${
                  isCurrentModule
                    ? 'border-ios-blue/30 bg-ios-blue/[0.04]'
                    : 'border-white/5 bg-neutral-900/60'
                }`}
              >
                {/* Module Header Accordion Button */}
                <button
                  onClick={() => toggleModule(group.moduleNumber)}
                  className="w-full p-3 flex items-center justify-between text-left gap-2 rounded-2xl hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isCurrentModule
                          ? 'bg-ios-blue text-white'
                          : isGroupAllDone
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-white/10 text-neutral-300'
                      }`}
                    >
                      {group.moduleNumber}
                    </span>
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">
                        {group.moduleTitle}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {groupCompletedCount}/{group.lessons.length} {t("виконано", locale)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-neutral-400">
                    {!isUnlocked ? (
                      <LockKeyhole className="w-3.5 h-3.5 text-neutral-500" />
                    ) : isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                {/* Module Lessons List */}
                {isExpanded && (
                  <div className="px-2 pb-2 pt-1 space-y-1">
                    {group.lessons.map((lessonItem) => {
                      const isCurrent = lessonItem.id === currentLessonId;
                      const isCompleted = completedLessonIds.includes(lessonItem.id);

                      if (!isUnlocked) {
                        return (
                          <div
                            key={lessonItem.id}
                            className="flex items-center justify-between p-2 rounded-xl text-xs text-neutral-500 opacity-50 cursor-not-allowed"
                          >
                            <span className="truncate flex items-center gap-2">
                              <LockKeyhole className="w-3 h-3 shrink-0" />
                              <span className="truncate">{lessonItem.title}</span>
                            </span>
                            <span className="text-[10px] shrink-0 font-mono">
                              {lessonItem.estimatedMinutes} {t("хв", locale)}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={lessonItem.id}
                          href={`/lessons/${lessonItem.id}`}
                          onClick={isMobileOpen ? onCloseMobile : undefined}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
                            isCurrent
                              ? 'bg-ios-blue text-white font-semibold shadow-md shadow-ios-blue/20'
                              : isCompleted
                              ? 'text-neutral-300 hover:text-white hover:bg-white/5'
                              : 'text-neutral-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            {isCompleted ? (
                              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-white' : 'text-emerald-400'}`} />
                            ) : (
                              <Circle className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-white' : 'text-neutral-600'}`} />
                            )}
                            <span className="truncate">{lessonItem.title}</span>
                          </div>
                          <span
                            className={`text-[10px] shrink-0 font-mono ${
                              isCurrent ? 'text-white/80' : 'text-neutral-500'
                            }`}
                          >
                            {lessonItem.estimatedMinutes} {t("хв", locale)}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: In This Lesson (Table of Contents Jump Links) */}
      {activeTab === 'sections' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
          <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-2 pt-1 pb-1">
            {locale === 'en' ? 'Quick navigation' : 'Швидкий перехід по уроку'}
          </p>
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => handleScrollToSection(section.id)}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-white/5 text-left transition-colors group"
              >
                <div className="w-5 h-5 rounded-lg bg-white/5 group-hover:bg-ios-blue/20 text-neutral-400 group-hover:text-ios-blue flex items-center justify-center shrink-0 transition-colors">
                  <Icon className="w-3 h-3" />
                </div>
                <span className="truncate">{section.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  // If Mobile Drawer Mode
  if (isMobileOpen) {
    return (
      <div className="fixed inset-0 z-50 flex lg:hidden animate-fadeIn">
        {/* Backdrop */}
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Slide-over panel */}
        <div className="relative w-80 max-w-[85vw] h-full bg-[#0d1117] border-r border-white/10 p-4 shadow-2xl flex flex-col z-10">
          {sidebarContent}
        </div>
      </div>
    );
  }

  // Desktop Inline Mode
  return (
    <div className="glass-panel p-4 rounded-3xl border border-white/10 h-full flex flex-col">
      {sidebarContent}
    </div>
  );
}

