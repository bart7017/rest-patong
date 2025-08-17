'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  EyeIcon, 
  ClockIcon, 
  GlobeAltIcon,
  FireIcon,
  TrendingUpIcon,
  PlusIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  todayScans: number;
  todayViews: number;
  topDish: {
    name: string;
    views: number;
  };
  avgSessionTime: number;
  languageDistribution: {
    language: string;
    percentage: number;
    flag: string;
  }[];
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    todayScans: 245,
    todayViews: 1847,
    topDish: {
      name: 'Tom Yum Kung',
      views: 234
    },
    avgSessionTime: 4.2,
    languageDistribution: [
      { language: 'English', percentage: 45, flag: '🇬🇧' },
      { language: 'Français', percentage: 25, flag: '🇫🇷' },
      { language: 'ไทย', percentage: 15, flag: '🇹🇭' },
      { language: 'Русский', percentage: 10, flag: '🇷🇺' },
      { language: 'Deutsch', percentage: 5, flag: '🇩🇪' },
    ]
  });

  const [isLoading, setIsLoading] = useState(false);

  const quickActions: QuickAction[] = [
    {
      title: 'Ajouter un Plat',
      description: 'Créer un nouveau plat au menu',
      icon: PlusIcon,
      href: '/dashboard/menu/add',
      color: 'bg-gradient-to-br from-green-500 to-emerald-600'
    },
    {
      title: 'Upload Photos',
      description: 'Ajouter des photos aux plats',
      icon: PhotoIcon,
      href: '/dashboard/photos',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600'
    },
    {
      title: 'Modifier Prix',
      description: 'Mettre à jour les tarifs',
      icon: CurrencyDollarIcon,
      href: '/dashboard/pricing',
      color: 'bg-gradient-to-br from-amber-500 to-orange-600'
    },
    {
      title: 'Analytics Détaillés',
      description: 'Rapports et statistiques',
      icon: ChartBarIcon,
      href: '/dashboard/analytics',
      color: 'bg-gradient-to-br from-purple-500 to-indigo-600'
    },
    {
      title: 'Gérer Promotions',
      description: 'Créer des offres spéciales',
      icon: FireIcon,
      href: '/dashboard/promotions',
      color: 'bg-gradient-to-br from-red-500 to-pink-600'
    },
    {
      title: 'Paramètres',
      description: 'Configuration du système',
      icon: CogIcon,
      href: '/dashboard/settings',
      color: 'bg-gradient-to-br from-gray-500 to-slate-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🏝️ Restaurant Patong
              </h1>
              <p className="mt-1 text-gray-600">
                Tableau de bord - {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Système Actif</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <EyeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-sm text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full">
                +12%
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Scans QR Aujourd'hui</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.todayScans}</p>
            <p className="text-xs text-gray-500 mt-1">vs {stats.todayScans - 27} hier</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-sm text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full">
                +8%
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Vues Menu Total</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.todayViews.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Cette semaine</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FireIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-sm text-orange-600 font-semibold bg-orange-100 px-2 py-1 rounded-full">
                HOT
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Plat #1</h3>
            <p className="text-2xl font-bold text-gray-900">{stats.topDish.name}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.topDish.views} consultations</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-sm text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded-full">
                Stable
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Temps Moyen</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.avgSessionTime}<span className="text-lg">min</span></p>
            <p className="text-xs text-gray-500 mt-1">par consultation</p>
          </div>
        </div>

        {/* Language Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <GlobeAltIcon className="h-5 w-5 mr-2 text-blue-600" />
              Répartition des Langues
            </h3>
            <span className="text-sm text-gray-500">Dernières 24h</span>
          </div>
          <div className="space-y-4">
            {stats.languageDistribution.map((lang, index) => (
              <div key={lang.language} className="flex items-center">
                <div className="flex items-center min-w-[120px]">
                  <span className="text-2xl mr-3">{lang.flag}</span>
                  <span className="text-sm font-medium text-gray-700">{lang.language}</span>
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${lang.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 min-w-[40px] text-right">
                  {lang.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <TrendingUpIcon className="h-5 w-5 mr-2 text-green-600" />
            Actions Rapides
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {/* Navigation logic */}}
                className="group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <div className={`absolute inset-0 ${action.color} opacity-90`}></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                      <span className="text-white text-sm">→</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{action.title}</h4>
                  <p className="text-white/80 text-sm">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Activité Récente</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <EyeIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Tom Yum Kung consulté</p>
                <p className="text-xs text-gray-500">Table 12 - Il y a 2 minutes</p>
              </div>
              <span className="text-xs text-blue-600 font-medium">🇬🇧 EN</span>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <PlusIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nouveau plat ajouté</p>
                <p className="text-xs text-gray-500">Pad Thai Végétarien - Il y a 1 heure</p>
              </div>
              <span className="text-xs text-green-600 font-medium">Admin</span>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <ChartBarIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Pic de consultations</p>
                <p className="text-xs text-gray-500">+150 vues dans la dernière heure</p>
              </div>
              <span className="text-xs text-purple-600 font-medium">Trend</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}