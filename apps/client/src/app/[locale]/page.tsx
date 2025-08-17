'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { analytics } from '@/utils/analytics';
import { 
  MagnifyingGlassIcon,
  XMarkIcon,
  PhoneIcon,
  HeartIcon,
  ShareIcon,
  ClockIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Dish {
  _id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  price: {
    amount: number;
    currency: string;
    isPromotion?: boolean;
    originalPrice?: number;
  };
  images: string[];
  preparationTime?: number;
  dietary: {
    isVegetarian: boolean;
    isVegan: boolean;
    isSpicy: boolean;
    spicyLevel?: number;
  };
  tags: {
    isNew: boolean;
    isPopular: boolean;
    isChefSpecial: boolean;
  };
  category: string;
}

interface Category {
  _id: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  icon?: string;
}

const translations = {
  fr: {
    welcome: "Bienvenue au Restaurant Patong",
    search: "Rechercher un plat...",
    callWaiter: "Appeler la serveuse",
    filters: {
      all: "Tous",
      vegetarian: "Végétarien", 
      vegan: "Vegan",
      spicy: "Épicé",
      popular: "Populaire",
      new: "Nouveau"
    },
    dietary: {
      vegetarian: "Végétarien",
      vegan: "Vegan",
      spicy: "Épicé"
    },
    tags: {
      new: "Nouveau",
      popular: "Populaire", 
      chefSpecial: "Spécialité Chef"
    },
    preparationTime: "Temps de préparation",
    minutes: "min",
    currency: "฿",
    noResults: "Aucun plat trouvé",
    tryOtherSearch: "Essayez un autre terme de recherche"
  },
  en: {
    welcome: "Welcome to Restaurant Patong",
    search: "Search for a dish...",
    callWaiter: "Call waitress",
    filters: {
      all: "All",
      vegetarian: "Vegetarian",
      vegan: "Vegan", 
      spicy: "Spicy",
      popular: "Popular",
      new: "New"
    },
    dietary: {
      vegetarian: "Vegetarian",
      vegan: "Vegan",
      spicy: "Spicy"
    },
    tags: {
      new: "New",
      popular: "Popular",
      chefSpecial: "Chef's Special"
    },
    preparationTime: "Preparation time",
    minutes: "min",
    currency: "฿",
    noResults: "No dishes found", 
    tryOtherSearch: "Try a different search term"
  },
  th: {
    welcome: "ยินดีต้อนรับสู่ร้านอาหารป่าตอง",
    search: "ค้นหาอาหาร...",
    callWaiter: "เรียกพนักงาน",
    filters: {
      all: "ทั้งหมด",
      vegetarian: "มังสวิรัติ",
      vegan: "วีแกน",
      spicy: "เผ็ด", 
      popular: "ยอดนิยม",
      new: "ใหม่"
    },
    dietary: {
      vegetarian: "มังสวิรัติ",
      vegan: "วีแกน",
      spicy: "เผ็ด"
    },
    tags: {
      new: "ใหม่",
      popular: "ยอดนิยม",
      chefSpecial: "พิเศษจากเชฟ"
    },
    preparationTime: "เวลาในการเตรียม",
    minutes: "นาที",
    currency: "฿",
    noResults: "ไม่พบอาหาร",
    tryOtherSearch: "ลองใช้คำค้นหาอื่น"
  },
  ru: {
    welcome: "Добро пожаловать в ресторан Патонг",
    search: "Найти блюдо...",
    callWaiter: "Вызвать официантку", 
    filters: {
      all: "Все",
      vegetarian: "Вегетарианское",
      vegan: "Веганское",
      spicy: "Острое",
      popular: "Популярное", 
      new: "Новое"
    },
    dietary: {
      vegetarian: "Вегетарианское",
      vegan: "Веганское",
      spicy: "Острое"
    },
    tags: {
      new: "Новое",
      popular: "Популярное",
      chefSpecial: "От шефа"
    },
    preparationTime: "Время приготовления",
    minutes: "мин",
    currency: "฿",
    noResults: "Блюда не найдены",
    tryOtherSearch: "Попробуйте другой поисковый запрос"
  },
  de: {
    welcome: "Willkommen im Restaurant Patong",
    search: "Gericht suchen...",
    callWaiter: "Service rufen",
    filters: {
      all: "Alle",
      vegetarian: "Vegetarisch", 
      vegan: "Vegan",
      spicy: "Scharf",
      popular: "Beliebt",
      new: "Neu"
    },
    dietary: {
      vegetarian: "Vegetarisch",
      vegan: "Vegan", 
      spicy: "Scharf"
    },
    tags: {
      new: "Neu",
      popular: "Beliebt",
      chefSpecial: "Chefs Empfehlung"
    },
    preparationTime: "Zubereitungszeit",
    minutes: "Min",
    currency: "฿",
    noResults: "Keine Gerichte gefunden",
    tryOtherSearch: "Versuchen Sie einen anderen Suchbegriff"
  }
};

export default function MenuPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || 'fr';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCallWaiter, setShowCallWaiter] = useState(false);

  const t = translations[locale as keyof typeof translations] || translations.fr;

  // Simulation des données (remplacez par vraie API)
  useEffect(() => {
    // Démarrer le tracking de session
    analytics.startSession();
    
    // Simuler le chargement
    setTimeout(() => {
      setCategories([
        {
          _id: '1',
          name: {
            fr: 'Entrées',
            en: 'Appetizers', 
            th: 'อาหารเรียกน้ำย่อย',
            ru: 'Закуски',
            de: 'Vorspeisen'
          },
          icon: '🍤'
        },
        {
          _id: '2', 
          name: {
            fr: 'Plats Principaux',
            en: 'Main Courses',
            th: 'อาหารจานหลัก', 
            ru: 'Основные блюда',
            de: 'Hauptgerichte'
          },
          icon: '🍜'
        }
      ]);

      setDishes([
        {
          _id: '1',
          name: {
            fr: 'Tom Yum Kung',
            en: 'Tom Yum Kung',
            th: 'ต้มยำกุ้ง',
            ru: 'Том Ям Кунг',
            de: 'Tom Yum Kung'
          },
          description: {
            fr: 'Soupe épicée aux crevettes avec citronnelle et galanga',
            en: 'Spicy shrimp soup with lemongrass and galangal',
            th: 'ต้มยำกุ้งรสจัดจ้าน เปรื้อยไปด้วยกลิ่นหอมของตะไคร้และข่า',
            ru: 'Острый креветочный суп с лемонграссом и галангалом',
            de: 'Scharfe Garnelensuppe mit Zitronengras und Galgant'
          },
          price: {
            amount: 220,
            currency: 'THB'
          },
          images: ['/images/tom-yum.jpg'],
          preparationTime: 15,
          dietary: {
            isVegetarian: false,
            isVegan: false,
            isSpicy: true,
            spicyLevel: 3
          },
          tags: {
            isNew: false,
            isPopular: true,
            isChefSpecial: false
          },
          category: '2'
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const changeLanguage = (newLocale: string) => {
    router.push(`/${newLocale}`);
  };

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name[locale]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dish.description[locale]?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'vegetarian') return matchesSearch && dish.dietary.isVegetarian;
    if (selectedFilter === 'vegan') return matchesSearch && dish.dietary.isVegan;
    if (selectedFilter === 'spicy') return matchesSearch && dish.dietary.isSpicy;
    if (selectedFilter === 'popular') return matchesSearch && dish.tags.isPopular;
    if (selectedFilter === 'new') return matchesSearch && dish.tags.isNew;
    
    return matchesSearch;
  });

  const toggleFavorite = (dishId: string) => {
    setFavorites(prev => {
      const isAdding = !prev.includes(dishId);
      if (isAdding) {
        // Tracker l'ajout aux favoris
        analytics.trackFavorite(dishId, locale);
        return [...prev, dishId];
      } else {
        return prev.filter(id => id !== dishId);
      }
    });
  };

  const handleCallWaiter = () => {
    setShowCallWaiter(true);
    setTimeout(() => setShowCallWaiter(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">{t.welcome}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-orange-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Info */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🏝️</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">Restaurant Patong</h1>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-sm text-gray-600 font-medium">Patong Beach, Phuket</p>
                </div>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-1 bg-white rounded-full p-1 shadow-md border">
              {[
                { code: 'fr', flag: '🇫🇷' },
                { code: 'en', flag: '🇬🇧' },
                { code: 'th', flag: '🇹🇭' },
                { code: 'ru', flag: '🇷🇺' },
                { code: 'de', flag: '🇩🇪' }
              ].map(({ code, flag }) => (
                <button
                  key={code}
                  onClick={() => changeLanguage(code)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    locale === code 
                      ? 'bg-orange-100 ring-2 ring-orange-500' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{flag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="px-4 py-6">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
            <span>Menu Digital QR</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {t.welcome} 🌺
          </h2>
          <p className="text-gray-600">
            Découvrez nos spécialités thaïlandaises authentiques
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <div className="max-w-md mx-auto px-4 mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearchTerm(newValue);
              // Tracker les recherches avec un délai pour éviter trop d'appels
              if (newValue.length > 2) {
                const timeoutId = setTimeout(() => {
                  analytics.trackSearch(newValue, locale);
                }, 1000);
                return () => clearTimeout(timeoutId);
              }
            }}
            placeholder={t.search}
            className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 placeholder-gray-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tags */}
      <div className="max-w-md mx-auto px-4 mb-8">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: t.filters.all, icon: '🍽️' },
            { id: 'popular', label: t.filters.popular, icon: '⭐' },
            { id: 'new', label: t.filters.new, icon: '🆕' },
            { id: 'spicy', label: t.filters.spicy, icon: '🌶️' },
            { id: 'vegetarian', label: t.filters.vegetarian, icon: '🌱' },
            { id: 'vegan', label: t.filters.vegan, icon: '🥗' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => {
                setSelectedFilter(filter.id);
                // Tracker l'utilisation du filtre
                if (filter.id !== 'all') {
                  analytics.trackFilter([filter.id], locale);
                }
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedFilter === filter.id
                  ? 'bg-orange-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:shadow-md hover:border-orange-300'
              }`}
            >
              <span className="mr-1">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      <main className="max-w-md mx-auto px-4 pb-32">
        {filteredDishes.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t.noResults}</h3>
            <p className="text-gray-600">{t.tryOtherSearch}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map(category => {
              const categoryDishes = filteredDishes.filter(dish => dish.category === category._id);
              
              if (categoryDishes.length === 0) return null;

              return (
                <div key={category._id}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <span className="mr-2 text-2xl">{category.icon}</span>
                      {category.name[locale]}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {categoryDishes.length}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {categoryDishes.map(dish => (
                      <div
                        key={dish._id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all transform hover:scale-[1.02]"
                        onClick={() => {
                          // Tracker la vue du plat
                          analytics.trackDishView(dish._id, locale);
                        }}
                      >
                        <div className="flex">
                          <div className="flex-1 p-5">
                            {/* Header avec prix */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-lg mb-1">
                                  {dish.name[locale]}
                                </h4>
                                {/* Tags */}
                                <div className="flex items-center space-x-2 mb-2">
                                  {dish.tags.isPopular && (
                                    <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                      ⭐ {t.tags.popular}
                                    </span>
                                  )}
                                  {dish.tags.isNew && (
                                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                      🆕 {t.tags.new}
                                    </span>
                                  )}
                                  {dish.tags.isChefSpecial && (
                                    <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                      👨‍🍳 {t.tags.chefSpecial}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <span className="font-bold text-orange-600 text-xl">
                                  {dish.price.amount} {t.currency}
                                </span>
                                {dish.price.isPromotion && dish.price.originalPrice && (
                                  <div className="text-sm text-gray-500 line-through">
                                    {dish.price.originalPrice} {t.currency}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                              {dish.description[locale]}
                            </p>

                            {/* Dietary & Time Info */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {dish.dietary.isSpicy && (
                                  <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                    🌶️ {t.dietary.spicy}
                                  </span>
                                )}
                                {dish.dietary.isVegetarian && (
                                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                    🌱 {t.dietary.vegetarian}
                                  </span>
                                )}
                                {dish.dietary.isVegan && (
                                  <span className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                    🥗 {t.dietary.vegan}
                                  </span>
                                )}
                              </div>
                              
                              {dish.preparationTime && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  {dish.preparationTime} {t.minutes}
                                </div>
                              )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                              <button
                                onClick={() => toggleFavorite(dish._id)}
                                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-500 transition-colors"
                              >
                                {favorites.includes(dish._id) ? (
                                  <HeartSolidIcon className="h-5 w-5 text-red-500" />
                                ) : (
                                  <HeartIcon className="h-5 w-5" />
                                )}
                                <span>Favoris</span>
                              </button>
                              
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  analytics.trackShare(dish._id, locale);
                                }}
                                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-500 transition-colors"
                              >
                                <ShareIcon className="h-5 w-5" />
                                <span>Partager</span>
                              </button>
                            </div>
                          </div>

                          {/* Image */}
                          <div className="w-28 h-28 m-4 bg-gradient-to-br from-orange-300 to-red-400 rounded-xl flex items-center justify-center shadow-lg">
                            {dish.images.length > 0 ? (
                              <Image
                                src={dish.images[0]}
                                alt={dish.name[locale]}
                                width={112}
                                height={112}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <span className="text-3xl">🍜</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Call Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-4">
          <button
            onClick={handleCallWaiter}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <PhoneIcon className="h-6 w-6" />
            <span className="text-lg">{t.callWaiter}</span>
          </button>
          <div className="text-center mt-2">
            <p className="text-xs text-gray-500">Commande directe auprès de votre serveuse</p>
          </div>
        </div>
      </div>

      {/* Call Notification */}
      {showCallWaiter && (
        <div className="fixed top-20 left-4 right-4 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-lg z-50 animate-bounce max-w-md mx-auto">
          <div className="text-center">
            <span className="text-2xl mb-2 block">✅</span>
            <p className="font-semibold">Serveuse appelée avec succès !</p>
            <p className="text-sm opacity-90">Elle arrivera dans quelques instants</p>
          </div>
        </div>
      )}
    </div>
  );
}