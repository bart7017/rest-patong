'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, type Locale, type TranslationKey } from '@/utils/translations';

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  availableLocales: Locale[];
  mounted: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('fr');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLocale = localStorage.getItem('admin-locale') as Locale;
    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale);
    }
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('admin-locale', newLocale);
  };

  const t = (key: TranslationKey): string => {
    return translations[locale]?.[key] || translations.fr[key] || key;
  };

  const value = {
    locale,
    setLocale: changeLocale,
    t,
    availableLocales: Object.keys(translations) as Locale[],
    mounted
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslations() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationProvider');
  }
  return context;
}