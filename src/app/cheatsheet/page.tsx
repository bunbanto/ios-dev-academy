'use client';

import React, { useState } from 'react';
import {
  Code2,
  Search,
  Copy,
  Check,
  Sparkles,
  BookMarked,
  Filter
} from 'lucide-react';
import { CHEATSHEET_ITEMS } from '@/data/cheatsheet';
import CodeBlock from '@/components/CodeBlock';

export default function CheatsheetPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    'all',
    'Swift Basics',
    'SwiftUI Layout',
    'State & Data',
    'Async & Network',
    'SwiftData',
  ];

  const filteredItems = CHEATSHEET_ITEMS.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.syntax.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopySyntax = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ios-blue/10 border border-ios-blue/30 text-ios-blue text-xs font-semibold">
          <BookMarked className="w-3.5 h-3.5" />
          <span>Швидка допомога розробника</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Шпаргалка Swift та SwiftUI
        </h1>
        <p className="text-neutral-400 text-sm max-w-2xl leading-relaxed">
          Найуживаніші конструкції, синтаксис розгортання опціоналів, модифікатори SwiftUI та асинхронні патерни під рукою.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Шукати guard let, @State, async/await..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-ios-blue"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap border ${
                activeCategory === cat
                  ? 'bg-ios-blue text-white border-ios-blue shadow'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border-white/5'
              }`}
            >
              {cat === 'all' ? 'Всі теми' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cheatsheet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="glass-card p-6 rounded-3xl border border-white/10 hover:border-ios-blue/40 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-ios-blue/15 text-ios-blue">
                  {item.category}
                </span>

                <button
                  onClick={() => handleCopySyntax(item.id, item.syntax)}
                  className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Скопійовано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Копіювати синтаксис</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="p-2.5 bg-neutral-950/80 rounded-xl border border-white/5 font-mono text-xs text-ios-blue">
                {item.syntax}
              </div>
            </div>

            <div>
              <CodeBlock code={item.example} filename="Example.swift" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
