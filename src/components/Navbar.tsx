'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Flame, Smartphone, BookOpen, HelpCircle, Code2, FolderGit2, Menu, X } from 'lucide-react';
import { getUserProgress, UserProgress } from '@/lib/storage';

export default function Navbar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setProgress(getUserProgress());
    const handleStorage = () => setProgress(getUserProgress());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [pathname]);

  const navLinks = [
    { href: '/roadmap', label: 'Програма', icon: BookOpen },
    { href: '/simulator', label: 'iPhone Симулятор', icon: Smartphone },
    { href: '/quiz', label: 'Тренажер / Квіз', icon: HelpCircle },
    { href: '/cheatsheet', label: 'Шпаргалка', icon: Code2 },
    { href: '/projects', label: 'Проєкти', icon: FolderGit2 },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0d1117]/80 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-pink-500 to-ios-blue flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-xl tracking-tighter">iOS</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-white tracking-tight">SwiftLab</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-ios-blue/20 text-ios-blue border border-ios-blue/30">
                  Swift 6
                </span>
              </div>
              <p className="text-xs text-neutral-400 hidden sm:block">Академія iOS Розробки</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1.5 rounded-full border border-white/5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-ios-blue text-white shadow-md shadow-ios-blue/30'
                      : 'text-neutral-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Progress Stats */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/10 text-xs">
              <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
              <span className="text-neutral-300">Стрік:</span>
              <span className="font-bold text-orange-400">{progress?.streakDays ?? 1} дні</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-white/10 text-xs">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-neutral-300">Досвід:</span>
              <span className="font-bold text-yellow-400">{progress?.totalXp ?? 50} XP</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-neutral-950 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-ios-blue text-white' : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-4 border-t border-white/10 flex items-center justify-around text-xs">
            <div className="flex items-center gap-1.5 text-orange-400">
              <Flame className="w-4 h-4" />
              <span>{progress?.streakDays ?? 1} дні стрік</span>
            </div>
            <div className="flex items-center gap-1.5 text-yellow-400">
              <Zap className="w-4 h-4" />
              <span>{progress?.totalXp ?? 50} XP</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
