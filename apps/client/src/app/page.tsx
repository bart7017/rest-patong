'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Détection de la langue du navigateur
    const detectLanguage = () => {
      if (typeof window !== 'undefined') {
        const browserLang = navigator.language.toLowerCase();
        
        // Mappage des langues supportées
        if (browserLang.startsWith('fr')) return 'fr';
        if (browserLang.startsWith('th')) return 'th';
        if (browserLang.startsWith('ru')) return 'ru';
        if (browserLang.startsWith('de')) return 'de';
        
        // Par défaut: anglais
        return 'en';
      }
      return 'fr'; // Fallback serveur
    };

    const language = detectLanguage();
    router.push(`/${language}`);
  }, [router]);

  // Page de chargement pendant la redirection
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">🏝️</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-xl">Restaurant Patong</h1>
            <p className="text-sm text-gray-600">Chargement du menu...</p>
          </div>
        </div>
        <div className="flex space-x-2 justify-center">
          {[
            { code: 'fr', flag: '🇫🇷' },
            { code: 'en', flag: '🇬🇧' },
            { code: 'th', flag: '🇹🇭' },
            { code: 'ru', flag: '🇷🇺' },
            { code: 'de', flag: '🇩🇪' }
          ].map(({ code, flag }) => (
            <button
              key={code}
              onClick={() => router.push(`/${code}`)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-orange-100 hover:scale-110"
            >
              <span className="text-2xl">{flag}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}