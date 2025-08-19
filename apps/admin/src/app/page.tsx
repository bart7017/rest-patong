'use client';

import { useState, useEffect } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { initialDishes, initialCategories, initialIngredients } from '@/data/initialData';
import { 
  EyeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  GlobeAltIcon,
  TagIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';

interface AdminStats {
  todayViews: number;
  totalDishes: number;
  topDish: {
    name: string;
    views: number;
  };
  recentActivity: {
    action: string;
    dish: string;
    time: string;
  }[];
}

interface Category {
  _id: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  icon?: string;
  image?: string;
  order: number;
}

interface Ingredient {
  _id: string;
  name: Record<string, string>;
  image?: string;
  allergens: {
    gluten: boolean;
    dairy: boolean;
    eggs: boolean;
    nuts: boolean;
    shellfish: boolean;
    soy: boolean;
    fish: boolean;
    peanuts: boolean;
  };
}

interface Dish {
  _id: string;
  name: Record<string, string>;
  price: number;
  category: string;
  isActive: boolean;
  views: number;
  image?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    todayViews: 1247,
    totalDishes: 0,
    topDish: {
      name: '',
      views: 0
    },
    recentActivity: []
  });

  const [persistedDishes] = usePersistedState('admin-dishes-v6-fresh', initialDishes);
  
  // Convertir les données persistées au format attendu par la homepage
  const dishes = persistedDishes.map((dish: any) => ({
    _id: dish._id,
    name: dish.name,
    price: dish.price?.amount || dish.price || 0,
    category: dish.categoryName || dish.category,
    isActive: dish.isActive,
    views: dish.views
  }));

  const [selectedLanguage, setSelectedLanguage] = useState('fr');

  // Calculer automatiquement les statistiques basées sur les données réelles
  useEffect(() => {
    // Calculer le nombre total de plats
    const totalDishes = dishes.length;
    
    // Calculer le plat le plus consulté
    const topDish = dishes.reduce((prev, current) => {
      return (prev.views > current.views) ? prev : current;
    }, dishes[0]);
    
    // Créer des activités récentes basées sur les plats
    const recentActivity = [
      { action: 'Consulté', dish: topDish?.name[selectedLanguage] || 'Tom Yum Kung', time: 'Il y a 2 min' },
      { action: 'Ajouté', dish: dishes[dishes.length - 1]?.name[selectedLanguage] || 'Nouveau plat', time: 'Il y a 1 heure' },
      { action: 'Modifié', dish: dishes[1]?.name[selectedLanguage] || 'Pad Thai', time: 'Il y a 3 heures' }
    ];
    
    setStats(prev => ({
      ...prev,
      totalDishes,
      topDish: {
        name: topDish?.name[selectedLanguage] || '',
        views: topDish?.views || 0
      },
      recentActivity
    }));
  }, [dishes, selectedLanguage]);

  // Simuler l'incrémentation automatique des vues pour démontrer les mises à jour
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        todayViews: prev.todayViews + Math.floor(Math.random() * 3) + 1 // +1 à 3 vues par intervalle
      }));
    }, 10000); // Toutes les 10 secondes

    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    if (confirm('Êtes-vous sûr de vouloir actualiser les données ? Cela va recharger les dernières modifications.')) {
      // Clear all localStorage
      localStorage.clear();
      // Reload the page to get fresh data
      window.location.reload();
    }
  };

  const editDish = (dishId: string) => {
    // Redirect to dishes page with edit mode
    window.location.href = `/dishes?edit=${dishId}`;
  };

  const deleteDish = (dishId: string, dishName: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le plat "${dishName}" ?\n\nCette action est irréversible.`)) {
      // This would need to be implemented with proper state management
      // For now, redirect to dishes page where deletion can be handled
      window.location.href = `/dishes?delete=${dishId}`;
    }
  };


  // Mock data for categories and ingredients
  const [categories, setCategories] = usePersistedState<Category[]>('admin-categories', initialCategories);
  const [ingredients, setIngredients] = usePersistedState<Ingredient[]>('admin-ingredients', initialIngredients);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🏝️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Papy - Admin</h1>
                <p className="text-sm text-gray-600">Gestion du menu digital</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Quick Navigation */}
              <div className="flex items-center space-x-2">
                <a
                  href="/dishes"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2 text-gray-600 hover:text-orange-600 text-sm"
                  title="Gérer les plats"
                >
                  <span className="text-lg">🍽️</span>
                  <span className="hidden sm:inline">Plats</span>
                </a>
                <a
                  href="/categories"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2 text-gray-600 hover:text-blue-600 text-sm"
                  title="Gérer les catégories"
                >
                  <TagIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Catégories</span>
                </a>
                <a
                  href="/ingredients"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2 text-gray-600 hover:text-green-600 text-sm"
                  title="Gérer les ingrédients"
                >
                  <BeakerIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Ingrédients</span>
                </a>
                <a
                  href="/analytics"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2 text-gray-600 hover:text-purple-600 text-sm"
                  title="Analytics détaillés"
                >
                  <ChartBarIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </a>
              </div>
              
              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              
              <button
                onClick={refreshData}
                className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                title="Actualiser les données"
              >
                🔄 Actualiser
              </button>
              
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>En ligne</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Consultations Aujourd'hui</p>
                <p className="text-3xl font-bold text-gray-900">{stats.todayViews}</p>
                <p className="text-sm text-green-600">+15% vs hier</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <EyeIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Plats au Menu</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalDishes}</p>
                <p className="text-sm text-gray-600">{categories.length} catégories</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Plat le Plus Consulté</p>
                <p className="text-xl font-bold text-gray-900">{stats.topDish.name}</p>
                <p className="text-sm text-orange-600">{stats.topDish.views} vues</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/dishes" className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all">
              <span className="text-3xl mb-2">🍽️</span>
              <span className="text-sm font-medium">Gérer Plats</span>
            </a>

            <a href="/categories" className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all">
              <TagIcon className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Gérer Catégories</span>
            </a>

            <a href="/ingredients" className="flex flex-col items-center p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all">
              <BeakerIcon className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Gérer Ingrédients</span>
            </a>

            <a href="/analytics" className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all">
              <ChartBarIcon className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Analytics</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Management */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Gestion du Menu</h3>
                  <div className="flex items-center space-x-2">
                    <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {languages.find(l => l.code === selectedLanguage)?.flag} 
                      {languages.find(l => l.code === selectedLanguage)?.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {dishes.map(dish => (
                  <div key={dish._id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-300 to-red-400 rounded-lg flex items-center justify-center">
                          <span className="text-xl">🍜</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {dish.name[selectedLanguage as keyof typeof dish.name]}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{dish.price} ฿</span>
                            <span>•</span>
                            <span>{dish.category}</span>
                            <span>•</span>
                            <span>{dish.views} vues</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${dish.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <button 
                          onClick={() => editDish(dish._id)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Modifier le plat"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => deleteDish(dish._id, dish.name[selectedLanguage as keyof typeof dish.name])}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Supprimer le plat"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
              <div className="space-y-4">
                {stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <EyeIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.dish} {activity.action.toLowerCase()}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Liens Utiles</h3>
              <div className="space-y-2">
                <a href="/menu/fr" target="_blank" className="block text-sm text-blue-600 hover:text-blue-800">
                  🇫🇷 Voir menu français
                </a>
                <a href="/menu/en" target="_blank" className="block text-sm text-blue-600 hover:text-blue-800">
                  🇬🇧 Voir menu anglais
                </a>
                <a href="/menu/th" target="_blank" className="block text-sm text-blue-600 hover:text-blue-800">
                  🇹🇭 Voir menu thaï
                </a>
                <a href="/analytics" className="block text-sm text-blue-600 hover:text-blue-800">
                  📊 Analytics détaillés
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}