'use client';
import { t } from '@/i18n/ui';

import React, { useEffect, useState } from 'react';
import {
  Smartphone,
  Code2,
  Sparkles,
  Coffee,
  User,
  ListTodo,
  CloudSun,
  Calculator,
  ScanFace,
  Copy,
  Check,
  Apple,
  ExternalLink
} from 'lucide-react';
import IPhoneMockup from '@/components/IPhoneMockup';
import { PLAYGROUND_EXAMPLES } from '@/data/playground-examples';
import { useLocale } from '@/i18n/LocaleContext';
import { localizeContent } from '@/i18n/content';

export default function SimulatorPage() {
  const { locale } = useLocale();
  const examples = localizeContent(PLAYGROUND_EXAMPLES, locale);
  const [selectedExampleId, setSelectedExampleId] = useState<string>('counter');
  const [editedCode, setEditedCode] = useState('');
  const [copiedXcode, setCopiedXcode] = useState(false);

  const currentExample =
    examples.find((e) => e.id === selectedExampleId) || examples[0];

  useEffect(() => {
    setEditedCode(currentExample.swiftCode);
  }, [currentExample.id, currentExample.swiftCode]);

  const handleCopyForXcode = async () => {
    try {
      await navigator.clipboard.writeText(editedCode);
      setCopiedXcode(true);
      setTimeout(() => setCopiedXcode(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const iconsMap: Record<string, any> = {
    counter: Coffee,
    profile: User,
    todo: ListTodo,
    weather: CloudSun,
    tipcalc: Calculator,
    biometric: ScanFace,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ios-blue/10 border border-ios-blue/30 text-ios-blue text-xs font-semibold mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            <span>SwiftUI Live Simulator 16 Pro</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t("Інтерактивна пісочниця iPhone", locale)}
          </h1>
          <p className="text-neutral-400 text-sm mt-1 max-w-2xl">
            {t("Взаємодійте з елементами інтерфейсу прямо у браузері, вивчайте вихідний код SwiftUI та копіюйте його для використання у власному проєкті Xcode.", locale)}
          </p>
        </div>

        <button
          onClick={handleCopyForXcode}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/10"
        >
          {copiedXcode ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">{t("Скопійовано для Xcode!", locale)}</span>
            </>
          ) : (
            <>
              <Apple className="w-4 h-4 text-ios-blue" />
              <span>{t("Копіювати для Xcode", locale)}</span>
            </>
          )}
        </button>
      </div>

      {/* Component Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {examples.map((item) => {
          const Icon = iconsMap[item.id] || Sparkles;
          const isSelected = item.id === selectedExampleId;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedExampleId(item.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap border ${
                isSelected
                  ? 'bg-ios-blue text-white border-ios-blue shadow-lg shadow-ios-blue/20'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border-white/5 hover:border-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Simulator Workspace (Split View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: The Virtual iPhone */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-24">
            <IPhoneMockup key={currentExample.id} interactiveType={currentExample.interactiveType} swiftCode={editedCode} />
            <div className="text-center mt-3 space-y-1">
              <span className="text-xs font-bold text-white block">iPhone 16 Pro Simulator</span>
              <p className="text-[11px] text-neutral-500">
                {t("Змініть підтримувані значення у коді — прев’ю оновиться. Кнопки в iPhone також працюють.", locale)}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Code & SwiftUI Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-ios-blue uppercase tracking-wider">
                <span>{currentExample.category}</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1">{currentExample.title}</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {currentExample.description}
              </p>
            </div>

            {/* Editable Swift code */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-neutral-400">
                  ContentView.swift
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-neutral-500">SwiftUI · редактор</span>
                  <button onClick={() => setEditedCode(currentExample.swiftCode)} className="text-[11px] text-ios-blue hover:text-white">{t("Скинути код", locale)}</button>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0d1117] shadow-xl my-4">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                  <span className="text-neutral-400 font-mono text-xs">ContentView.swift</span>
                  <span className="text-[11px] text-neutral-500">{editedCode.split('\n').length} рядків</span>
                </div>
                <textarea
                  aria-label="Редагувати SwiftUI код"
                  spellCheck={false}
                  value={editedCode}
                  onChange={(event) => setEditedCode(event.target.value)}
                  className="block w-full min-h-[420px] resize-y bg-[#0d1117] p-4 text-xs leading-6 font-mono text-neutral-200 outline-none focus:ring-1 focus:ring-inset focus:ring-ios-blue whitespace-pre"
                />
                <p className="border-t border-white/10 px-4 py-2 text-[11px] text-neutral-500">{t("Код готовий до копіювання: вставте його у ContentView.swift в Xcode і запустіть без додаткових налаштувань.", locale)}</p>
              </div>
            </div>
          </div>

          {/* Quick Guide to Run in Xcode */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Apple className="w-4 h-4 text-ios-blue" />
              <span>{t("Як запустити цей код на власному iPhone або Mac?", locale)}</span>
            </h4>
            <ol className="space-y-2 text-xs text-neutral-300 list-decimal list-inside leading-relaxed">
              <li>{t("Відкрийте", locale)} <strong>Xcode</strong> {t("на вашому Mac (безплатно в Mac App Store).", locale)}</li>
              <li>{t("Створіть новий проєкт:", locale)} <strong>File → New → Project → iOS App</strong> {t("(оберіть інтерфейс SwiftUI).", locale)}</li>
              <li>{t("Замініть весь вміст файлу", locale)} <code className="text-ios-blue font-mono">ContentView.swift</code> {t("скопійованим вище кодом.", locale)}</li>
              <li>{t("Натисніть", locale)} <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-white/10 font-mono">⌘ + R</kbd> {t("для запуску або увімкніть Canvas Preview (⌥ + ⌘ + ↩), щоб побачити інтерфейс миттєво!", locale)}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

