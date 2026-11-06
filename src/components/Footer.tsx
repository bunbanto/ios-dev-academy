"use client";

import { useLocale } from "@/i18n/LocaleContext";
import { t } from "@/i18n/ui";
import React from "react";
import Link from "next/link";
import { Apple, Github, Sparkles, Heart } from "lucide-react";

export default function Footer() {
  const { locale } = useLocale();
  return (
    <footer className="border-t border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 text-sm mt-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-ios-blue flex items-center justify-center text-white">
                <Apple className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base">SwiftLab</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {t(
                "Сучасна інтерактивна платформа для вивчення розробки застосунків для iPhone, iPad та всієї екосистеми Apple на базі Swift 6 та SwiftUI.",
                locale,
              )}
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {t("Навчання", locale)}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/roadmap"
                  className="hover:text-white transition-colors"
                >
                  {t("Повна програма курсу", locale)}
                </Link>
              </li>
              <li>
                <Link
                  href="/simulator"
                  className="hover:text-white transition-colors"
                >
                  {t("Інтерактивний iPhone", locale)}
                </Link>
              </li>
              <li>
                <Link
                  href="/quiz"
                  className="hover:text-white transition-colors"
                >
                  {t("Тренажер співбесід", locale)}
                </Link>
              </li>
              <li>
                <Link
                  href="/cheatsheet"
                  className="hover:text-white transition-colors"
                >
                  {t("Шпаргалка розробника", locale)}
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-ios-blue hover:underline transition-colors font-medium"
                >
                  {t("Особистий кабінет студента", locale)}
                </Link>
              </li>
              <li>
                <Link
                  href="/profile?tab=certificate"
                  className="hover:text-yellow-400 transition-colors"
                >
                  {t("Офіційний сертифікат", locale)}
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {t("Apple Екосистема", locale)}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://developer.apple.com/swift/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t("Офіційний сайт Swift.org ↗", locale)}
                </a>
              </li>
              <li>
                <a
                  href="https://developer.apple.com/xcode/swiftui/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t("SwiftUI Документація ↗", locale)}
                </a>
              </li>
              <li>
                <a
                  href="https://developer.apple.com/sf-symbols/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t("SF Symbols Бібліотека ↗", locale)}
                </a>
              </li>
              <li>
                <a
                  href="https://developer.apple.com/app-store/review/guidelines/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {t("Правила App Store Review ↗", locale)}
                </a>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {t("Стандарти 2026", locale)}
            </h4>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2 py-1 rounded bg-neutral-900 border border-white/10 text-neutral-300">
                Swift 6.0
              </span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-white/10 text-neutral-300">
                iOS 18 Ready
              </span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-white/10 text-neutral-300">
                SwiftData
              </span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-white/10 text-neutral-300">
                @Observable
              </span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-white/10 text-neutral-300">
                Xcode 16 Ready
              </span>
            </div>
            <p className="mt-4 text-[11px] text-neutral-500">
              {t(
                "Інтерактивна навчальна програма для майбутніх iOS розробників з практикою в Xcode та симулятором.",
                locale,
              )}
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>
            © {new Date().getFullYear()}{" "}
            {t("SwiftLab Academy. Всі права захищено.", locale)}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>iOS 18 & Swift 6 Ready</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
