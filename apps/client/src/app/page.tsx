'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const router = useRouter();

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const translations = {
    fr: {
      welcome: 'Bienvenue',
      viewMenu: 'Voir le Menu',
      selectLanguage: 'Choisir la langue'
    },
    en: {
      welcome: 'Welcome',
      viewMenu: 'View Menu',
      selectLanguage: 'Select Language'
    },
    th: {
      welcome: 'ยินดีต้อนรับ',
      viewMenu: 'ดูเมนู',
      selectLanguage: 'เลือกภาษา'
    },
    ru: {
      welcome: 'Добро пожаловать',
      viewMenu: 'Посмотреть меню',
      selectLanguage: 'Выбрать язык'
    },
    de: {
      welcome: 'Willkommen',
      viewMenu: 'Menü ansehen',
      selectLanguage: 'Sprache wählen'
    }
  };

  useEffect(() => {
    // Détection de la langue du navigateur
    const detectLanguage = () => {
      if (typeof window !== 'undefined') {
        const browserLang = navigator.language.toLowerCase();
        
        if (browserLang.startsWith('fr')) return 'fr';
        if (browserLang.startsWith('th')) return 'th';
        if (browserLang.startsWith('ru')) return 'ru';
        if (browserLang.startsWith('de')) return 'de';
        
        return 'en';
      }
      return 'fr';
    };

    const language = detectLanguage();
    setSelectedLanguage(language);
  }, []);

  const handleViewMenu = () => {
    router.push(`/${selectedLanguage}`);
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
  };

  const currentTranslations = translations[selectedLanguage as keyof typeof translations];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex flex-col">
      {/* Language Selector - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2">
          <div className="flex space-x-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  selectedLanguage === lang.code
                    ? 'bg-orange-500 scale-110 shadow-lg'
                    : 'hover:bg-orange-100 hover:scale-105'
                }`}
                title={lang.name}
              >
                <span className="text-2xl">{lang.flag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-6">
              <span className="text-white font-bold text-6xl">🏝️</span>
            </div>
            
            {/* Restaurant Name */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Papy
            </h1>
            
            {/* Welcome Message */}
            <p className="text-xl text-gray-600 mb-8">
              {currentTranslations.welcome}
            </p>
          </div>

          {/* Menu Button */}
          <button
            onClick={handleViewMenu}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-2xl text-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3 mx-auto"
          >
            <span>📖</span>
            <span>{currentTranslations.viewMenu}</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-sm text-gray-500">
          Conçu par <span className="font-semibold text-orange-600">SBInnovate</span>
        </p>
      </footer>
    </div>
  );
}