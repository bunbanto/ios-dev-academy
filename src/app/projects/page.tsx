'use client';

import React, { useState } from 'react';
import {
  FolderGit2,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Code2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PORTFOLIO_PROJECTS } from '@/data/projects';
import CodeBlock from '@/components/CodeBlock';

export default function ProjectsPage() {
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(PORTFOLIO_PROJECTS[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedProjectId(expandedProjectId === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Портфоліо розробника</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Практичні проєкти для вашого резюме
        </h1>
        <p className="text-neutral-400 text-sm max-w-2xl leading-relaxed">
          Роботодавці на співбесідах завжди шукають реальний досвід. Зберіть ці повноцінні проєкти, додайте їх у свій GitHub та продемонструйте знання архітектури й SwiftData.
        </p>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {PORTFOLIO_PROJECTS.map((proj) => {
          const isExpanded = expandedProjectId === proj.id;

          return (
            <div
              key={proj.id}
              className={`glass-panel rounded-3xl border transition-all ${
                isExpanded ? 'border-ios-blue/40 shadow-2xl' : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Project Card Header */}
              <div
                onClick={() => toggleExpand(proj.id)}
                className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        proj.level === 'Junior'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}
                    >
                      {proj.level} Проєкт
                    </span>
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {proj.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-neutral-300">
                    {proj.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <button className="px-4 py-2 rounded-xl bg-ios-blue/20 hover:bg-ios-blue/30 text-ios-blue text-xs font-semibold flex items-center gap-1.5 transition-all">
                    <span>{isExpanded ? 'Сховати інструкцію' : 'Покроковий план'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Guide Content */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-6">
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="space-y-6">
                    {proj.steps.map((step, idx) => (
                      <div key={idx} className="space-y-3 glass-card p-5 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-ios-blue text-white font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-white">{step.title}</h4>
                        </div>

                        <p className="text-xs text-neutral-300 leading-relaxed">
                          {step.description}
                        </p>

                        <CodeBlock code={step.code} filename={`Step${idx + 1}.swift`} />

                        {step.tips && (
                          <div className="p-3 bg-neutral-900 rounded-xl text-xs text-neutral-400 border border-white/5">
                            💡 <strong>Порада:</strong> {step.tips}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-neutral-900/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-neutral-400">
                      Готові поділитися проєктом? Завантажте його на GitHub та додайте тег <code className="text-ios-blue">#swiftlab-ios</code>.
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

