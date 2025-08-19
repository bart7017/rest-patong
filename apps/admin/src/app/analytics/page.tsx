'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  EyeIcon, 
  ClockIcon, 
  GlobeAltIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  DevicePhoneMobileIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface AnalyticsData {
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    avgSessionTime: number;
    conversionRate: number;
    trends: {
      views: number;
      visitors: number;
      sessionTime: number;
    };
  };
  topDishes: {
    name: string;
    views: number;
    trend: number;
    languages: { code: string; percentage: number }[];
  }[];
  languageStats: {
    language: string;
    code: string;
    flag: string;
    percentage: number;
    views: number;
    trend: number;
  }[];
  timeAnalytics: {
    hourly: { hour: number; views: number }[];
    daily: { day: string; views: number }[];
    weekly: { week: string; views: number }[];
  };
  searchTerms: {
    term: string;
    count: number;
    trend: number;
  }[];
  deviceStats: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    overview: {
      totalViews: 12847,
      uniqueVisitors: 3241,
      avgSessionTime: 4.2,
      conversionRate: 15.8,
      trends: {
        views: 12,
        visitors: 8,
        sessionTime: -5
      }
    },
    topDishes: [
      {
        name: 'French Tacos Personnalisable',
        views: 1456,
        trend: 25,
        languages: [
          { code: 'fr', percentage: 45 },
          { code: 'en', percentage: 30 },
          { code: 'de', percentage: 15 }
        ]
      },
      {
        name: 'Burger Classique',
        views: 1234,
        trend: 18,
        languages: [
          { code: 'en', percentage: 40 },
          { code: 'fr', percentage: 35 },
          { code: 'ru', percentage: 20 }
        ]
      },
      {
        name: 'French Tacos Signature',
        views: 987,
        trend: 12,
        languages: [
          { code: 'fr', percentage: 55 },
          { code: 'en', percentage: 30 },
          { code: 'de', percentage: 15 }
        ]
      }
    ],
    languageStats: [
      { language: 'English', code: 'en', flag: '🇬🇧', percentage: 45, views: 5781, trend: 10 },
      { language: 'Français', code: 'fr', flag: '🇫🇷', percentage: 25, views: 3212, trend: 5 },
      { language: 'ไทย', code: 'th', flag: '🇹🇭', percentage: 15, views: 1927, trend: 15 },
      { language: 'Русский', code: 'ru', flag: '🇷🇺', percentage: 10, views: 1285, trend: 8 },
      { language: 'Deutsch', code: 'de', flag: '🇩🇪', percentage: 5, views: 642, trend: 3 }
    ],
    timeAnalytics: {
      hourly: [
        { hour: 6, views: 45 }, { hour: 7, views: 78 }, { hour: 8, views: 134 },
        { hour: 9, views: 189 }, { hour: 10, views: 267 }, { hour: 11, views: 345 },
        { hour: 12, views: 456 }, { hour: 13, views: 398 }, { hour: 14, views: 334 },
        { hour: 15, views: 278 }, { hour: 16, views: 234 }, { hour: 17, views: 289 },
        { hour: 18, views: 456 }, { hour: 19, views: 567 }, { hour: 20, views: 634 },
        { hour: 21, views: 543 }, { hour: 22, views: 345 }, { hour: 23, views: 234 }
      ],
      daily: [
        { day: 'Lun', views: 1845 }, { day: 'Mar', views: 2134 }, { day: 'Mer', views: 1987 },
        { day: 'Jeu', views: 2245 }, { day: 'Ven', views: 2567 }, { day: 'Sam', views: 3456 },
        { day: 'Dim', views: 2987 }
      ],
      weekly: [
        { week: 'S1', views: 8765 }, { week: 'S2', views: 9234 }, { week: 'S3', views: 8945 },
        { week: 'S4', views: 10234 }
      ]
    },
    searchTerms: [
      { term: 'tacos', count: 567, trend: 28 },
      { term: 'burger', count: 423, trend: 15 },
      { term: 'fromage', count: 234, trend: 12 },
      { term: 'poulet', count: 189, trend: 8 },
      { term: 'frites', count: 156, trend: 5 }
    ],
    deviceStats: {
      mobile: 85,
      tablet: 10,
      desktop: 5
    }
  });

  const [timeRange, setTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const maxViews = Math.max(...data.timeAnalytics.hourly.map(item => item.views));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Navigation de retour */}
              <Link 
                href="/"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <ChartBarIcon className="h-8 w-8 mr-3 text-blue-600" />
                  Analytics Détaillés
                </h1>
                <p className="mt-1 text-gray-600">
                  Statistiques complètes du menu QR - {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="day">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <EyeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className={`text-sm font-semibold px-2 py-1 rounded-full flex items-center ${
                data.overview.trends.views > 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
              }`}>
                {data.overview.trends.views > 0 ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {Math.abs(data.overview.trends.views)}%
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Consultations</h3>
            <p className="text-3xl font-bold text-gray-900">{formatNumber(data.overview.totalViews)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className={`text-sm font-semibold px-2 py-1 rounded-full flex items-center ${
                data.overview.trends.visitors > 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
              }`}>
                {data.overview.trends.visitors > 0 ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {Math.abs(data.overview.trends.visitors)}%
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Visiteurs Uniques</h3>
            <p className="text-3xl font-bold text-gray-900">{formatNumber(data.overview.uniqueVisitors)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className={`text-sm font-semibold px-2 py-1 rounded-full flex items-center ${
                data.overview.trends.sessionTime > 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
              }`}>
                {data.overview.trends.sessionTime > 0 ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {Math.abs(data.overview.trends.sessionTime)}%
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Temps Moyen</h3>
            <p className="text-3xl font-bold text-gray-900">{data.overview.avgSessionTime}<span className="text-lg">min</span></p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-sm text-purple-600 font-semibold bg-purple-100 px-2 py-1 rounded-full">
                Excellent
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Taux Engagement</h3>
            <p className="text-3xl font-bold text-gray-900">{data.overview.conversionRate}%</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Hourly Traffic */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <CalendarDaysIcon className="h-5 w-5 mr-2 text-blue-600" />
              Trafic par Heure
            </h3>
            <div className="space-y-3">
              {data.timeAnalytics.hourly.filter(item => item.hour >= 8 && item.hour <= 23).map((item) => (
                <div key={item.hour} className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 w-12">
                    {item.hour}h
                  </span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${(item.views / maxViews) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                    {item.views}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Language Distribution */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <GlobeAltIcon className="h-5 w-5 mr-2 text-green-600" />
              Répartition des Langues
            </h3>
            <div className="space-y-4">
              {data.languageStats.map((lang) => (
                <div key={lang.code} className="flex items-center">
                  <div className="flex items-center min-w-[140px]">
                    <span className="text-2xl mr-3">{lang.flag}</span>
                    <span className="text-sm font-medium text-gray-700">{lang.language}</span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${lang.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <span className="text-sm font-semibold text-gray-900">
                      {lang.percentage}%
                    </span>
                    <div className={`text-xs flex items-center justify-end ${
                      lang.trend > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {lang.trend > 0 ? (
                        <ArrowUpIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(lang.trend)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Dishes */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FireIcon className="h-5 w-5 mr-2 text-orange-600" />
            Top 5 Plats les Plus Consultés
          </h3>
          <div className="space-y-4">
            {data.topDishes.map((dish, index) => (
              <div key={dish.name} className="flex items-center p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center min-w-[60px]">
                  <span className={`text-2xl font-bold ${
                    index === 0 ? 'text-yellow-500' : 
                    index === 1 ? 'text-gray-400' : 
                    index === 2 ? 'text-orange-600' : 'text-gray-600'
                  }`}>
                    #{index + 1}
                  </span>
                </div>
                <div className="flex-1 mx-4">
                  <h4 className="text-lg font-semibold text-gray-900">{dish.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    {dish.languages.slice(0, 3).map((lang) => (
                      <span key={lang.code} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {lang.code.toUpperCase()} {lang.percentage}%
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-gray-900">{formatNumber(dish.views)}</span>
                  <div className={`text-sm flex items-center justify-end ${
                    dish.trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {dish.trend > 0 ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(dish.trend)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Terms */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <MagnifyingGlassIcon className="h-5 w-5 mr-2 text-purple-600" />
              Termes de Recherche Populaires
            </h3>
            <div className="space-y-3">
              {data.searchTerms.map((term) => (
                <div key={term.term} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">{term.term}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900">{term.count}</span>
                    <div className={`text-xs flex items-center ${
                      term.trend > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {term.trend > 0 ? (
                        <ArrowUpIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3 mr-1" />
                      )}
                      {Math.abs(term.trend)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Stats */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <DevicePhoneMobileIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Répartition par Appareil
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📱</span>
                  <span className="text-sm font-medium text-gray-700">Mobile</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{data.deviceStats.mobile}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full"
                  style={{ width: `${data.deviceStats.mobile}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📱</span>
                  <span className="text-sm font-medium text-gray-700">Tablette</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{data.deviceStats.tablet}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full"
                  style={{ width: `${data.deviceStats.tablet}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">💻</span>
                  <span className="text-sm font-medium text-gray-700">Desktop</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{data.deviceStats.desktop}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-gray-500 to-slate-500 h-3 rounded-full"
                  style={{ width: `${data.deviceStats.desktop}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}