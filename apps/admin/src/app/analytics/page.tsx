'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from '@/contexts/TranslationContext';
import { api } from '@/lib/api';
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
  const { t, locale } = useTranslations();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données analytics depuis l'API
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setIsLoading(true);
        console.log('Analytics: Loading data from API...');
        const analyticsData = await api.getAnalytics();
        console.log('Analytics: Received data:', analyticsData);
        setData(analyticsData);
      } catch (error) {
        console.error('Analytics: Error loading data:', error);
        // En cas d'erreur, utiliser des données par défaut
        setData({
          overview: {
            totalViews: 0,
            uniqueVisitors: 0,
            avgSessionTime: 0,
            conversionRate: 0,
            trends: { views: 0, visitors: 0, sessionTime: 0 }
          },
          topDishes: [],
          languageStats: [],
          timeAnalytics: {
            hourly: [],
            daily: [],
            weekly: []
          },
          searchTerms: [],
          deviceStats: { mobile: 0, tablet: 0, desktop: 0 }
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const maxViews = data ? Math.max(...data.timeAnalytics.hourly.map(item => item.views)) : 0;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">{t('error')}</p>
        </div>
      </div>
    );
  }

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
                <span className="text-sm font-medium">{t('dashboard')}</span>
              </Link>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <ChartBarIcon className="h-8 w-8 mr-3 text-blue-600" />
                  {t('detailedAnalytics')}
                </h1>
                <p className="mt-1 text-gray-600">
                  {t('completeQRMenuStats')} - {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="day">{t('today')}</option>
                <option value="week">{t('thisWeek')}</option>
                <option value="month">{t('thisMonth')}</option>
                <option value="year">{t('thisYear')}</option>
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
            <h3 className="text-sm font-medium text-gray-600 mb-1">{t('totalConsultations')}</h3>
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
            <h3 className="text-sm font-medium text-gray-600 mb-1">{t('uniqueVisitors')}</h3>
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
            <h3 className="text-sm font-medium text-gray-600 mb-1">{t('averageTime')}</h3>
            <p className="text-3xl font-bold text-gray-900">{data.overview.avgSessionTime.toFixed(2)}<span className="text-lg">min</span></p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-sm text-purple-600 font-semibold bg-purple-100 px-2 py-1 rounded-full">
                {t('excellent')}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{t('engagementRate')}</h3>
            <p className="text-3xl font-bold text-gray-900">{data.overview.conversionRate.toFixed(2)}%</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Hourly Traffic */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <CalendarDaysIcon className="h-5 w-5 mr-2 text-blue-600" />
              {t('trafficByHour')}
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
              {t('languageDistribution')}
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
            {t('topDishes')}
          </h3>
          <div className="space-y-4">
            {data.topDishes.map((dish, index) => (
              <div key={dish.name.fr} className="flex items-center p-4 bg-gray-50 rounded-xl">
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
                  <h4 className="text-lg font-semibold text-gray-900">{dish.name[locale] || dish.name.fr}</h4>
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
              {t('popularSearchTerms')}
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
              {t('deviceDistribution')}
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📱</span>
                  <span className="text-sm font-medium text-gray-700">{t('mobile')}</span>
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
                  <span className="text-sm font-medium text-gray-700">{t('tablet')}</span>
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
                  <span className="text-sm font-medium text-gray-700">{t('desktop')}</span>
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