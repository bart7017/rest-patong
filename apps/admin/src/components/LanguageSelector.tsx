'use client';

import { useTranslations } from '@/contexts/TranslationContext';
import type { Locale } from '@/utils/translations';

export function LanguageSelector() {
  const { locale, setLocale } = useTranslations();
  
  const languages = [
    { code: 'fr' as Locale, flag: '🇫🇷', name: 'Français' },
    { code: 'en' as Locale, flag: '🇬🇧', name: 'English' },
    { code: 'th' as Locale, flag: '🇹🇭', name: 'ไทย' },
    { code: 'ru' as Locale, flag: '🇷🇺', name: 'Русский' },
    { code: 'de' as Locale, flag: '🇩🇪', name: 'Deutsch' }
  ];
  
  return (
    <div className="flex items-center space-x-1 bg-white rounded-full p-1 shadow-md border">
      {languages.map(({ code, flag }) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            locale === code 
              ? 'bg-blue-100 ring-2 ring-blue-500' 
              : 'hover:bg-gray-100'
          }`}
          title={languages.find(l => l.code === code)?.name}
        >
          <span className="text-lg">{flag}</span>
        </button>
      ))}
    </div>
  );
}