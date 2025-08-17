'use client';

import { useState, useEffect } from 'react';
import { 
  EyeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  GlobeAltIcon
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
    totalDishes: 24,
    topDish: {
      name: 'Tom Yum Kung',
      views: 156
    },
    recentActivity: [
      { action: 'Consulté', dish: 'Pad Thai', time: 'Il y a 2 min' },
      { action: 'Ajouté', dish: 'Green Curry', time: 'Il y a 1 heure' },
      { action: 'Modifié', dish: 'Som Tam', time: 'Il y a 3 heures' }
    ]
  });

  const [dishes, setDishes] = useState<Dish[]>([
    {
      _id: '1',
      name: {
        fr: 'Tom Yum Kung',
        en: 'Tom Yum Kung',
        th: 'ต้มยำกุ้ง',
        ru: 'Том Ям Кунг',
        de: 'Tom Yum Kung'
      },
      price: 220,
      category: 'Soupes',
      isActive: true,
      views: 156
    },
    {
      _id: '2',
      name: {
        fr: 'Pad Thai',
        en: 'Pad Thai',
        th: 'ผัดไทย',
        ru: 'Пад Тай',
        de: 'Pad Thai'
      },
      price: 180,
      category: 'Nouilles',
      isActive: true,
      views: 134
    }
  ]);

  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [showAddDish, setShowAddDish] = useState(false);

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
                <h1 className="text-2xl font-bold text-gray-900">Restaurant Patong - Admin</h1>
                <p className="text-sm text-gray-600">Gestion du menu digital</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
                <p className="text-sm text-gray-600">5 catégories</p>
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
            <button
              onClick={() => setShowAddDish(true)}
              className="flex flex-col items-center p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <PlusIcon className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Ajouter Plat</span>
            </button>

            <button className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-500 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all">
              <PhotoIcon className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Upload Photos</span>
            </button>

            <button className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all">
              <CurrencyDollarIcon className="h-8 w-8 mb-2" />
              <span className="text-sm font-medium">Modifier Prix</span>
            </button>

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
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
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
                <a href="/qr-codes" className="block text-sm text-blue-600 hover:text-blue-800">
                  📱 Générer QR codes
                </a>
                <a href="/analytics" className="block text-sm text-blue-600 hover:text-blue-800">
                  📊 Analytics détaillés
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Dish Modal (Simple) */}
      {showAddDish && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un Plat</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom (Français)
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: Tom Yum Kung"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (฿)
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="220"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>Entrées</option>
                  <option>Plats principaux</option>
                  <option>Desserts</option>
                  <option>Boissons</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddDish(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowAddDish(false)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}