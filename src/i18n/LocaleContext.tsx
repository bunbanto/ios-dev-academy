'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type Locale = 'uk' | 'en';

const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void } | null>(null);

export function LocaleProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const [locale, updateLocale] = useState<Locale>(initialLocale);
  const setLocale = (nextLocale: Locale) => {
    document.cookie = `swiftlab_locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = nextLocale;
    updateLocale(nextLocale);
  };

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useLocale must be used inside LocaleProvider');
  return value;
}
