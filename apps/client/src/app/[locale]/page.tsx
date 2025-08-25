'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { analytics } from '@/utils/analytics';
import { api, type Dish, type Category } from '@/lib/api';
import { initialDishes, initialCategories } from '@/data/initialData';
import { 
  PhoneIcon,
  HeartIcon,
  ShareIcon,
  ClockIcon,
  XMarkIcon,
  FireIcon,
  ArrowLeftIcon
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
    welcome: "Bienvenue chez Papy",
    callWaiter: "Appeler la serveuse",
    callTeamMessage: "Faites signe à notre équipe pour commander ! 🙋‍♀️",
    filters: {
      all: "Tous",
      vegetarian: "Végétarien", 
      vegan: "Vegan",
      spicy: "Épicé",
      popular: "Populaire",
      new: "Nouveau",
      chefSpecial: "Spécialité du Chef",
      seasonal: "De saison",
      limitedTime: "Édition limitée"
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
    tryOtherSearch: "Essayez un autre terme de recherche",
    designedBy: "Conçu par",
    chooseCategory: "Choisissez une catégorie pour découvrir nos plats",
    filterSearch: "Recherche par filtre",
    dishesMatchingFilter: "Plats correspondant au filtre :",
    addToFavorites: "Ajouter aux favoris",
    share: "Partager",
    filterByPreferences: "Filtrer par préférences",
    waiterCalledSuccess: "Serveuse appelée avec succès !",
    waiterArriving: "Elle arrivera dans quelques instants",
    noMatchingDishes: "Aucun plat ne correspond à ce filtre",
    viewAllDishes: "Voir tous les plats",
    backToCategories: "Retour aux catégories",
    dishes: "plats",
    ourMenu: "Notre Menu"
  },
  en: {
    welcome: "Welcome to Papy",
    callWaiter: "Call waitress",
    callTeamMessage: "Wave to our team to order! 🙋‍♀️",
    filters: {
      all: "All",
      vegetarian: "Vegetarian",
      vegan: "Vegan", 
      spicy: "Spicy",
      popular: "Popular",
      new: "New",
      chefSpecial: "Chef's Special",
      seasonal: "Seasonal",
      limitedTime: "Limited Time"
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
    tryOtherSearch: "Try a different search term",
    designedBy: "Designed by",
    chooseCategory: "Choose a category to discover our dishes",
    filterSearch: "Filter search",
    dishesMatchingFilter: "Dishes matching filter:",
    addToFavorites: "Add to favorites",
    share: "Share",
    filterByPreferences: "Filter by preferences",
    waiterCalledSuccess: "Waitress called successfully!",
    waiterArriving: "She will arrive in a few moments",
    noMatchingDishes: "No dishes match this filter",
    viewAllDishes: "View all dishes",
    backToCategories: "Back to categories",
    dishes: "dishes",
    ourMenu: "Our Menu"
  },
  th: {
    welcome: "ยินดีต้อนรับสู่ร้านอาหาร Papy",
    callWaiter: "เรียกพนักงาน",
    callTeamMessage: "โบกมือเรียกทีมงานเพื่อสั่งอาหาร! 🙋‍♀️",
    filters: {
      all: "ทั้งหมด",
      vegetarian: "มังสวิรัติ",
      vegan: "วีแกน",
      spicy: "เผ็ด", 
      popular: "ยอดนิยม",
      new: "ใหม่",
      chefSpecial: "พิเศษเชฟ",
      seasonal: "ตามฤดูกาล",
      limitedTime: "จำกัดเวลา"
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
    tryOtherSearch: "ลองใช้คำค้นหาอื่น",
    designedBy: "ออกแบบโดย",
    chooseCategory: "เลือกหมวดหมู่เพื่อค้นหาอาหารของเรา",
    filterSearch: "ค้นหาตามตัวกรอง",
    dishesMatchingFilter: "อาหารที่ตรงกับตัวกรอง:",
    addToFavorites: "เพิ่มไปยังรายการโปรด",
    share: "แบ่งปัน",
    filterByPreferences: "กรองตามความชอบ",
    waiterCalledSuccess: "เรียกพนักงานเสิร์ฟสำเร็จ!",
    waiterArriving: "เธอจะมาในอีกสักครู่",
    noMatchingDishes: "ไม่มีอาหารที่ตรงกับตัวกรองนี้",
    viewAllDishes: "ดูอาหารทั้งหมด",
    backToCategories: "กลับไปหมวดหมู่",
    dishes: "อาหาร",
    ourMenu: "เมนูของเรา"
  },
  ru: {
    welcome: "Добро пожаловать в ресторан Papy",
    callWaiter: "Вызвать официантку",
    callTeamMessage: "Помашите нашей команде, чтобы заказать! 🙋‍♀️",
    filters: {
      all: "Все",
      vegetarian: "Вегетарианское",
      vegan: "Веганское",
      spicy: "Острое",
      popular: "Популярное", 
      new: "Новое",
      chefSpecial: "От шефа",
      seasonal: "Сезонное",
      limitedTime: "Ограниченная серия"
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
    tryOtherSearch: "Попробуйте другой поисковый запрос",
    designedBy: "Разработано",
    chooseCategory: "Выберите категорию, чтобы открыть наши блюда",
    filterSearch: "Поиск по фильтру",
    dishesMatchingFilter: "Блюда, соответствующие фильтру:",
    addToFavorites: "Добавить в избранное",
    share: "Поделиться",
    filterByPreferences: "Фильтр по предпочтениям",
    waiterCalledSuccess: "Официантка успешно вызвана!",
    waiterArriving: "Она прибудет через несколько мгновений",
    noMatchingDishes: "Ни одно блюдо не соответствует этому фильтру",
    viewAllDishes: "Посмотреть все блюда",
    backToCategories: "Вернуться к категориям",
    dishes: "блюда",
    ourMenu: "Наше меню"
  },
  de: {
    welcome: "Willkommen bei Papy",
    callWaiter: "Service rufen",
    callTeamMessage: "Winken Sie unserem Team zum Bestellen! 🙋‍♀️",
    filters: {
      all: "Alle",
      vegetarian: "Vegetarisch", 
      vegan: "Vegan",
      spicy: "Scharf",
      popular: "Beliebt",
      new: "Neu",
      chefSpecial: "Chefs Empfehlung",
      seasonal: "Saisonal",
      limitedTime: "Begrenzte Zeit"
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
    tryOtherSearch: "Versuchen Sie einen anderen Suchbegriff",
    designedBy: "Entworfen von",
    chooseCategory: "Wählen Sie eine Kategorie, um unsere Gerichte zu entdecken",
    filterSearch: "Filtersuche",
    dishesMatchingFilter: "Gerichte passend zum Filter:",
    addToFavorites: "Zu Favoriten hinzufügen",
    share: "Teilen",
    filterByPreferences: "Nach Vorlieben filtern",
    waiterCalledSuccess: "Kellnerin erfolgreich gerufen!",
    waiterArriving: "Sie wird in wenigen Augenblicken kommen",
    noMatchingDishes: "Keine Gerichte entsprechen diesem Filter",
    viewAllDishes: "Alle Gerichte anzeigen",
    backToCategories: "Zurück zu Kategorien",
    dishes: "Gerichte",
    ourMenu: "Unser Menü"
  }
};

export default function MenuPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || 'fr';
  
  const [currentView, setCurrentView] = useState<'categories' | 'dishes' | 'details'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCallWaiter, setShowCallWaiter] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const t = translations[locale as keyof typeof translations] || translations.fr;

  // Charger les données depuis l'API
  useEffect(() => {
    // Démarrer le tracking de session
    analytics.startSession();
    
    const loadData = async () => {
      try {
        setLoading(true);
        const [dishesData, categoriesData] = await Promise.all([
          api.getDishes(),
          api.getCategories()
        ]);
        
        // Filtrer les données actives
        const activeCategories = categoriesData.filter(cat => cat.isActive);
        const activeDishes = dishesData.filter(dish => dish.isActive);
        
        setCategories(activeCategories);
        setDishes(activeDishes);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // En cas d'erreur API, utiliser les données locales
        const activeCategories = initialCategories.filter(cat => cat.isActive);
        const activeDishes = initialDishes.filter(dish => dish.isActive);
        setCategories(activeCategories);
        setDishes(activeDishes);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const changeLanguage = (newLocale: string) => {
    router.push(`/${newLocale}`);
  };

  const filteredDishes = dishes.filter(dish => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'vegetarian') return dish.dietary.isVegetarian;
    if (selectedFilter === 'vegan') return dish.dietary.isVegan;
    if (selectedFilter === 'spicy') return dish.dietary.isSpicy;
    if (selectedFilter === 'popular') return dish.tags.isPopular;
    if (selectedFilter === 'new') return dish.tags.isNew;
    if (selectedFilter === 'chefSpecial') return dish.tags.isChefSpecial;
    if (selectedFilter === 'seasonal') return dish.tags.isSeasonal;
    if (selectedFilter === 'limitedTime') return dish.tags.isLimitedTime;
    
    return true;
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">{t.welcome}</p>
        </div>
      </div>
    );
  }

  const handleBackNavigation = () => {
    if (currentView === 'details') {
      setCurrentView('dishes');
      setSelectedDish(null);
    } else if (currentView === 'dishes') {
      setCurrentView('categories');
      setSelectedCategory(null);
    }
  };

  const showBackButton = currentView !== 'categories';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-emerald-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Info with Back Button */}
            <div className="flex items-center space-x-3">
              {showBackButton && (
                <button
                  onClick={handleBackNavigation}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
              )}
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🏝️</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">Papy</h1>
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
                      ? 'bg-emerald-100 ring-2 ring-emerald-500' 
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




      {/* Menu Content */}
      <main className="flex-1 max-w-md mx-auto px-4 pb-32 pt-8">
        {currentView === 'categories' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {t.ourMenu} 🍽️
              </h2>
              <p className="text-gray-600 mb-4">
                {t.chooseCategory}
              </p>
              <button
                onClick={() => setShowFilters(true)}
                className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:bg-emerald-600 transition-all transform hover:scale-105 flex items-center mx-auto"
              >
                <span className="mr-2">🔍</span>
                {t.filterSearch}
              </button>
            </div>
            
            {/* Afficher les résultats de filtre si un filtre est sélectionné */}
            {selectedFilter !== 'all' ? (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {t.dishesMatchingFilter}
                  </h3>
                  <div className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-2xl">
                    <span className="mr-2">
                      {[
                        { id: 'popular', icon: '🔥' },
                        { id: 'new', icon: '🆕' },
                        { id: 'chefSpecial', icon: '👨‍🍳' },
                        { id: 'seasonal', icon: '🌱' },
                        { id: 'limitedTime', icon: '⏰' },
                        { id: 'spicy', icon: '🌶️' },
                        { id: 'vegetarian', icon: '🥬' },
                        { id: 'vegan', icon: '🥗' }
                      ].find(f => f.id === selectedFilter)?.icon}
                    </span>
                    {[
                      { id: 'popular', label: t.filters.popular },
                      { id: 'new', label: t.filters.new },
                      { id: 'chefSpecial', label: t.filters.chefSpecial },
                      { id: 'seasonal', label: t.filters.seasonal },
                      { id: 'limitedTime', label: t.filters.limitedTime },
                      { id: 'spicy', label: t.filters.spicy },
                      { id: 'vegetarian', label: t.filters.vegetarian },
                      { id: 'vegan', label: t.filters.vegan }
                    ].find(f => f.id === selectedFilter)?.label}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {filteredDishes.slice(0, 10).map(dish => (
                    <div
                      key={dish._id}
                      onClick={() => {
                        setSelectedDish(dish);
                        setCurrentView('details');
                        analytics.trackDishView(dish._id, dish.name[locale], locale);
                      }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
                    >
                      <div className="h-32 bg-gradient-to-br from-emerald-300 to-emerald-400 flex items-center justify-center">
                        {dish.images.length > 0 ? (
                          <Image
                            src={dish.images[0]}
                            alt={dish.name[locale]}
                            width={200}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-4xl">🍜</span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start space-x-2 flex-1">
                            <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[24px] text-center">
                              {dish.order || 1}
                            </span>
                            <h3 className="font-semibold text-gray-900 text-base flex-1">
                              {dish.name[locale]}
                            </h3>
                          </div>
                          <span className="font-bold text-emerald-600 text-lg ml-2">
                            {dish.price.amount} {t.currency}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2 flex-wrap">
                          {dish.tags.isPopular && (
                            <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                              🔥
                            </span>
                          )}
                          {dish.tags.isNew && (
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              🆕
                            </span>
                          )}
                          {dish.tags.isChefSpecial && (
                            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                              👨‍🍳
                            </span>
                          )}
                          {dish.tags.isSeasonal && (
                            <span className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                              🌱
                            </span>
                          )}
                          {dish.tags.isLimitedTime && (
                            <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                              ⏰
                            </span>
                          )}
                          {dish.dietary.isSpicy && (
                            <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                              🌶️
                            </span>
                          )}
                          {dish.dietary.isVegetarian && (
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              🥬
                            </span>
                          )}
                          {dish.dietary.isVegan && (
                            <span className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                              🥗
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {dish.description[locale]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredDishes.length === 0 && (
                  <div className="text-center py-12">
                    <span className="text-6xl mb-4 block">😔</span>
                    <p className="text-gray-600 mb-4">{t.noMatchingDishes}</p>
                    <button
                      onClick={() => setSelectedFilter('all')}
                      className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-medium"
                    >
                      {t.viewAllDishes}
                    </button>
                  </div>
                )}
                
                <div className="text-center">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    {t.backToCategories}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {categories.map(category => {
                  const categoryDishes = dishes.filter(dish => dish.category === category._id);
                  
                  return (
                    <div
                      key={category._id}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentView('dishes');
                      }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-3xl">{category.icon}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">
                        {category.name[locale]}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {categoryDishes.length} {t.dishes}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {currentView === 'dishes' && selectedCategory && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                <span className="mr-2 text-3xl">{selectedCategory.icon}</span>
                {selectedCategory.name[locale]}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {dishes
                .filter(dish => dish.category === selectedCategory._id)
                .map(dish => (
                  <div
                    key={dish._id}
                    onClick={() => {
                      setSelectedDish(dish);
                      setCurrentView('details');
                      analytics.trackDishView(dish._id, locale);
                    }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all transform hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="h-48 bg-gradient-to-br from-emerald-300 to-emerald-400 flex items-center justify-center">
                      {dish.images.length > 0 ? (
                        <Image
                          src={dish.images[0]}
                          alt={dish.name[locale]}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-6xl">🍜</span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3 flex-1">
                          <span className="bg-emerald-500 text-white text-sm font-bold px-2.5 py-1 rounded-full min-w-[28px] text-center">
                            {dish.order || 1}
                          </span>
                          <h3 className="font-semibold text-gray-900 text-lg flex-1">
                            {dish.name[locale]}
                          </h3>
                        </div>
                        <span className="font-bold text-emerald-600 text-xl ml-4">
                          {dish.price.amount} {t.currency}
                        </span>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex items-center space-x-2 mb-3">
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
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {dish.description[locale]}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {currentView === 'details' && selectedDish && (
          <div className="space-y-6">
            {/* Image principale */}
            <div className="h-64 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-2xl flex items-center justify-center overflow-hidden">
              {selectedDish.images.length > 0 ? (
                <Image
                  src={selectedDish.images[0]}
                  alt={selectedDish.name[locale]}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl">🍜</span>
              )}
            </div>

            {/* Détails du plat */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 flex-1">
                  <span className="bg-emerald-500 text-white text-lg font-bold px-3 py-1.5 rounded-full min-w-[36px] text-center">
                    {selectedDish.order || 1}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900 flex-1">
                    {selectedDish.name[locale]}
                  </h1>
                </div>
                <span className="font-bold text-emerald-600 text-2xl ml-4">
                  {selectedDish.price.amount} {t.currency}
                </span>
              </div>

              {/* Tags */}
              <div className="flex items-center space-x-2 mb-4">
                {selectedDish.tags.isPopular && (
                  <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                    ⭐ {t.tags.popular}
                  </span>
                )}
                {selectedDish.tags.isNew && (
                  <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    🆕 {t.tags.new}
                  </span>
                )}
                {selectedDish.tags.isChefSpecial && (
                  <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    👨‍🍳 {t.tags.chefSpecial}
                  </span>
                )}
              </div>

              <p className="text-gray-700 text-base leading-relaxed mb-6">
                {selectedDish.description[locale]}
              </p>

              {/* Informations diététiques */}
              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex items-center space-x-3">
                  {selectedDish.dietary.isSpicy && (
                    <span className="inline-flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      🌶️ {t.dietary.spicy}
                    </span>
                  )}
                  {selectedDish.dietary.isVegetarian && (
                    <span className="inline-flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      🌱 {t.dietary.vegetarian}
                    </span>
                  )}
                  {selectedDish.dietary.isVegan && (
                    <span className="inline-flex items-center px-3 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                      🥗 {t.dietary.vegan}
                    </span>
                  )}
                </div>
              </div>

              {/* Temps de préparation */}
              {selectedDish.preparationTime && (
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm">
                      {t.preparationTime}: {selectedDish.preparationTime} {t.minutes}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <button
                  onClick={() => toggleFavorite(selectedDish._id)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  {favorites.includes(selectedDish._id) ? (
                    <HeartSolidIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                  <span>{t.addToFavorites}</span>
                </button>
                
                <button 
                  onClick={() => {
                    analytics.trackShare(selectedDish._id, locale);
                  }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors"
                >
                  <ShareIcon className="h-6 w-6" />
                  <span>{t.share}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer avec SBInnovate et Call Button */}
      <div className="bg-white border-t border-gray-200 shadow-lg mt-auto">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="text-center space-y-2">
            <div className="bg-emerald-100 border border-emerald-300 rounded-xl p-3 mb-2">
              <p className="text-base text-emerald-800 font-semibold">
                {t.callTeamMessage}
              </p>
            </div>
            <p className="text-xs text-gray-400">
              {t.designedBy} <span className="font-semibold text-emerald-600">SBInnovate</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-3xl w-full max-w-md mx-auto p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{t.filterByPreferences}</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'all', label: t.filters.all, icon: '🍽️', description: 'Voir tous les plats' },
                { id: 'popular', label: t.filters.popular, icon: '🔥', description: 'Plats populaires' },
                { id: 'new', label: t.filters.new, icon: '🆕', description: 'Nouvelles créations' },
                { id: 'chefSpecial', label: t.filters.chefSpecial, icon: '👨‍🍳', description: 'Du chef' },
                { id: 'seasonal', label: t.filters.seasonal, icon: '🌱', description: 'De saison' },
                { id: 'limitedTime', label: t.filters.limitedTime, icon: '⏰', description: 'Édition limitée' },
                { id: 'spicy', label: t.filters.spicy, icon: '🌶️', description: 'Plats épicés' },
                { id: 'vegetarian', label: t.filters.vegetarian, icon: '🥬', description: 'Végétarien' },
                { id: 'vegan', label: t.filters.vegan, icon: '🥗', description: 'Végétal' }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setSelectedFilter(filter.id);
                    setShowFilters(false);
                    // Tracker l'utilisation du filtre
                    if (filter.id !== 'all') {
                      analytics.trackFilter([filter.id], locale);
                    }
                  }}
                  className={`p-4 rounded-2xl text-left transition-all ${
                    selectedFilter === filter.id
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-2xl block mb-2">{filter.icon}</span>
                    <h4 className="font-semibold text-sm mb-1">{filter.label}</h4>
                    <p className={`text-xs leading-tight ${
                      selectedFilter === filter.id ? 'text-emerald-100' : 'text-gray-500'
                    }`}>
                      {filter.description}
                    </p>
                    {selectedFilter === filter.id && (
                      <span className="text-white font-bold text-lg block mt-2">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="text-center text-sm text-gray-500">
                Filtre actuel : <span className="font-semibold text-emerald-500">
                  {[
                    { id: 'all', label: t.filters.all },
                    { id: 'popular', label: t.filters.popular },
                    { id: 'new', label: t.filters.new },
                    { id: 'chefSpecial', label: t.filters.chefSpecial },
                    { id: 'seasonal', label: t.filters.seasonal },
                    { id: 'limitedTime', label: t.filters.limitedTime },
                    { id: 'spicy', label: t.filters.spicy },
                    { id: 'vegetarian', label: t.filters.vegetarian },
                    { id: 'vegan', label: t.filters.vegan }
                  ].find(f => f.id === selectedFilter)?.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Notification */}
      {showCallWaiter && (
        <div className="fixed top-20 left-4 right-4 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-lg z-50 animate-bounce max-w-md mx-auto">
          <div className="text-center">
            <span className="text-2xl mb-2 block">✅</span>
            <p className="font-semibold">{t.waiterCalledSuccess}</p>
            <p className="text-sm opacity-90">{t.waiterArriving}</p>
          </div>
        </div>
      )}
    </div>
  );
}