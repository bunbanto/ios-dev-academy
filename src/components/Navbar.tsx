'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Zap,
  Flame,
  Smartphone,
  BookOpen,
  HelpCircle,
  Code2,
  FolderGit2,
  Menu,
  X,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { getUserProgress, UserProgress } from '@/lib/storage';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, openAuthModal, logout } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setProgress(getUserProgress());
    const handleStorage = () => setProgress(getUserProgress());
    window.addEventListener('storage', handleStorage);
    window.addEventListener('swiftlab_auth_change', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('swiftlab_auth_change', handleStorage);
    };
  }, [pathname]);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/roadmap', label: 'Програма', icon: BookOpen },
    { href: '/simulator', label: 'Симулятор', icon: Smartphone },
    { href: '/quiz', label: 'Тренажер', icon: HelpCircle },
    { href: '/cheatsheet', label: 'Шпаргалка', icon: Code2 },
    { href: '/projects', label: 'Проєкти', icon: FolderGit2 },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0d1117]/90 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 via-pink-500 to-ios-blue flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-lg tracking-tighter">iOS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg text-white tracking-tight">
                SwiftLab
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-ios-blue/20 text-ios-blue border border-ios-blue/30 hidden xs:inline-block">
                Swift 6
              </span>
            </div>
          </Link>

          {/* Desktop Nav (screens >= 1024px) */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/5 shrink-0">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
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

          {/* Right Section: Stats & Auth & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Combined Compact Stats (Streak + XP) */}
            {mounted && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-white/10 text-xs shrink-0">
                <div className="flex items-center gap-1 text-orange-400">
                  <Flame className="w-3.5 h-3.5 animate-pulse" />
                  <span className="font-bold">{progress?.streakDays ?? 1}д</span>
                </div>
                <span className="text-neutral-600 font-bold">•</span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="font-bold">{progress?.totalXp ?? 50} XP</span>
                </div>
              </div>
            )}

            {/* User Profile Dropdown or Sign In Button (ALWAYS VISIBLE) */}
            {mounted && user ? (
              <div className="relative shrink-0" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pr-2 sm:pr-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-white/10 hover:border-white/20 transition-all text-left"
                  aria-label="Профіль користувача"
                >
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white/20"
                        onError={(e) => {
                          // Fallback to initials if image fails to load
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-ios-blue to-purple-600 flex items-center justify-center text-white text-xs font-bold border border-white/20">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {user.isVerified && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-neutral-900 flex items-center justify-center">
                        <ShieldCheck className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-white max-w-[85px] sm:max-w-[110px] truncate hidden md:inline-block">
                    {user.name.split(' ')[0]}
                  </span>

                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#121622] border border-white/10 shadow-2xl p-2 z-50 animate-fadeIn">
                    <div className="p-3 border-b border-white/10 mb-1">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-neutral-400 truncate">{user.email}</p>
                      
                      <div className="mt-2 flex items-center gap-1.5">
                        {user.isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <ShieldCheck className="w-3 h-3" />
                            {user.provider === 'google' ? 'Google Верифікація' : 'Email Верифіковано'}
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              openAuthModal('verify');
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-colors"
                          >
                            <span>Потрібна верифікація</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-200 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4 text-ios-blue" />
                      <span>Особистий кабінет</span>
                    </Link>

                    <Link
                      href="/profile?tab=certificate"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-200 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span>Мій Сертифікат</span>
                    </Link>

                    <div className="h-px bg-white/5 my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Вийти з акаунту</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-ios-blue to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs font-semibold shadow-md shadow-ios-blue/20 transition-all shrink-0"
              >
                <User className="w-3.5 h-3.5" />
                <span>Увійти</span>
              </button>
            )}

            {/* Mobile / Tablet Menu Button (screens < 1024px) */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 transition-colors"
                aria-label={mobileMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer (visible when burger menu is open) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-neutral-950 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          
          {/* User Block inside Mobile Menu */}
          {user ? (
            <div className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-ios-blue to-purple-600 flex items-center justify-center text-white text-sm font-bold border border-white/20">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {user.isVerified && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-neutral-900 flex items-center justify-center">
                      <ShieldCheck className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{user.name}</p>
                  <p className="text-[11px] text-neutral-400">{user.email}</p>
                </div>
              </div>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-ios-blue text-white text-xs font-semibold shrink-0"
              >
                Кабінет
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal('login');
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-ios-blue to-purple-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow"
            >
              <User className="w-4 h-4" />
              <span>Увійти через Google або Email</span>
            </button>
          )}

          {/* Navigation Links */}
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-ios-blue text-white shadow'
                      : 'text-neutral-300 hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Log Out button inside Drawer */}
          {user && (
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Вийти з облікового запису</span>
              </button>
            </div>
          )}

          {/* Mobile Streak & XP Bar */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-around text-xs text-neutral-400">
            <div className="flex items-center gap-1.5 text-orange-400">
              <Flame className="w-4 h-4" />
              <span>{progress?.streakDays ?? 1} дні стрік</span>
            </div>
            <span className="text-neutral-700">•</span>
            <div className="flex items-center gap-1.5 text-yellow-400">
              <Zap className="w-4 h-4" />
              <span>{progress?.totalXp ?? 50} XP зароблено</span>
            </div>
          </div>

        </div>
      )}
    </header>
  );
}
