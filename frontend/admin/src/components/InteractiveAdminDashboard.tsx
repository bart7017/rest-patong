'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

interface DashboardStats {
  todayOrders: number
  totalRevenue: number
  menuItems: number
  qrScans: number
  activeTables: number
}

interface RecentActivity {
  id: string
  type: 'order' | 'qr_scan' | 'dish_added'
  message: string
  details: string
  timestamp: string
  color: 'green' | 'blue' | 'purple'
}

export default function InteractiveAdminDashboard() {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 42,
    totalRevenue: 12450,
    menuItems: 28,
    qrScans: 156,
    activeTables: 23
  })
  const [activities, setActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'order',
      message: 'Commande #PAT20241201042',
      details: 'Table 12 - 850 ฿',
      timestamp: '2 min',
      color: 'green'
    },
    {
      id: '2',
      type: 'qr_scan',
      message: 'QR scan Table 8',
      details: 'Menu consulté',
      timestamp: '5 min',
      color: 'blue'
    },
    {
      id: '3',
      type: 'dish_added',
      message: 'Nouveau plat ajouté',
      details: 'Tom Yum Kung',
      timestamp: '12 min',
      color: 'purple'
    }
  ])
  const [currentTime, setCurrentTime] = useState(new Date())

  // Get current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'fr'

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    // Simulate real-time updates
    const activityTimer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        qrScans: prev.qrScans + Math.floor(Math.random() * 3),
        todayOrders: prev.todayOrders + (Math.random() > 0.8 ? 1 : 0)
      }))
    }, 30000)

    return () => {
      clearInterval(timer)
      clearInterval(activityTimer)
    }
  }, [])

  const changeLanguage = (locale: string) => {
    const newPathname = pathname.replace(/^\/[^\/]+/, `/${locale}`)
    router.push(newPathname)
  }

  const handleQuickAction = (action: string) => {
    console.log(`Quick action: ${action}`)
    // Future: Navigate to specific pages or open modals
    switch (action) {
      case 'add_dish':
        alert('Navigation vers ajout de plat')
        break
      case 'view_orders':
        alert('Navigation vers commandes')
        break
      case 'generate_qr':
        alert('Génération de QR codes')
        break
      case 'manage_categories':
        alert('Gestion des catégories')
        break
      case 'view_analytics':
        alert('Navigation vers analytics')
        break
      case 'settings':
        alert('Navigation vers paramètres')
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🎛️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {t('restaurant.name')} - {t('auth.adminPanel')}
                </h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-600 font-medium">Back-office connecté</p>
                </div>
              </div>
            </div>
            
            {/* User Profile & Language */}
            <div className="flex items-center space-x-4">
              {/* Interactive Language Toggle */}
              <div className="flex items-center space-x-1 bg-white rounded-full p-1 shadow-md">
                <button
                  onClick={() => changeLanguage('fr')}
                  className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                    currentLocale === 'fr' ? 'bg-blue-100' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-sm font-medium">🇫🇷</span>
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                    currentLocale === 'en' ? 'bg-blue-100' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-sm font-medium">🇬🇧</span>
                </button>
              </div>
              
              {/* User Avatar */}
              <div className="flex items-center space-x-3 bg-white rounded-full pl-3 pr-4 py-2 shadow-md">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">👤</span>
                </div>
                <span className="text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t('auth.welcome')} ! 👋
              </h2>
              <p className="text-gray-600 text-lg">
                Tableau de bord - Restaurant Patong
              </p>
            </div>
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl shadow-lg">
              <p className="text-sm font-medium">Aujourd'hui</p>
              <p className="text-2xl font-bold">{currentTime.toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </div>

        {/* Real-time Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Orders Today */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-xl">📊</span>
              </div>
              <div className="text-green-500 text-sm font-semibold bg-green-100 px-2 py-1 rounded-full">
                +12%
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{t('dashboard.todayOrders')}</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.todayOrders}</p>
            <p className="text-xs text-gray-500 mt-1">vs {stats.todayOrders - 5} hier</p>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-xl">💰</span>
              </div>
              <div className="text-green-500 text-sm font-semibold bg-green-100 px-2 py-1 rounded-full">
                +8%
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{t('dashboard.totalRevenue')}</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()} ฿</p>
            <p className="text-xs text-gray-500 mt-1">Panier moyen: {Math.round(stats.totalRevenue / stats.todayOrders)} ฿</p>
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-xl">🍽️</span>
              </div>
              <div className="text-blue-500 text-sm font-semibold bg-blue-100 px-2 py-1 rounded-full">
                3 new
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Plats au menu</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.menuItems}</p>
            <p className="text-xs text-gray-500 mt-1">5 catégories</p>
          </div>

          {/* QR Scans */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white text-xl">📱</span>
              </div>
              <div className="text-orange-500 text-sm font-semibold bg-orange-100 px-2 py-1 rounded-full">
                Live
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">QR Scans</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.qrScans}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.activeTables} tables actives</p>
          </div>
        </div>

        {/* Quick Actions & Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Actions Rapides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Add Dish */}
              <button
                onClick={() => handleQuickAction('add_dish')}
                className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white cursor-pointer hover:from-primary-600 hover:to-primary-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <div className="text-center">
                  <span className="text-4xl mb-3 block">🍽️</span>
                  <h4 className="font-semibold mb-2">Ajouter un plat</h4>
                  <p className="text-primary-100 text-sm">Nouveau plat au menu</p>
                </div>
              </button>

              {/* View Orders */}
              <button
                onClick={() => handleQuickAction('view_orders')}
                className="bg-white rounded-2xl p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="text-center">
                  <span className="text-4xl mb-3 block">📋</span>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('navigation.orders')}</h4>
                  <p className="text-gray-600 text-sm">Suivre les commandes</p>
                  <div className="mt-3 inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    3 en attente
                  </div>
                </div>
              </button>

              {/* Generate QR */}
              <button
                onClick={() => handleQuickAction('generate_qr')}
                className="bg-white rounded-2xl p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="text-center">
                  <span className="text-4xl mb-3 block">📱</span>
                  <h4 className="font-semibold text-gray-900 mb-2">Générer QR</h4>
                  <p className="text-gray-600 text-sm">Nouveaux QR codes</p>
                </div>
              </button>

              {/* Categories */}
              <button
                onClick={() => handleQuickAction('manage_categories')}
                className="bg-white rounded-2xl p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="text-center">
                  <span className="text-4xl mb-3 block">📂</span>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('navigation.categories')}</h4>
                  <p className="text-gray-600 text-sm">Gérer catégories</p>
                </div>
              </button>

              {/* Analytics */}
              <button
                onClick={() => handleQuickAction('view_analytics')}
                className="bg-white rounded-2xl p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="text-center">
                  <span className="text-4xl mb-3 block">📊</span>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('navigation.analytics')}</h4>
                  <p className="text-gray-600 text-sm">Rapports détaillés</p>
                </div>
              </button>

              {/* Settings */}
              <button
                onClick={() => handleQuickAction('settings')}
                className="bg-white rounded-2xl p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="text-center">
                  <span className="text-4xl mb-3 block">⚙️</span>
                  <h4 className="font-semibold text-gray-900 mb-2">{t('navigation.settings')}</h4>
                  <p className="text-gray-600 text-sm">Configuration</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Activité Récente</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Voir tout
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="space-y-4">
                {activities.map(activity => (
                  <div key={activity.id} className={`flex items-center space-x-3 p-3 bg-${activity.color}-50 rounded-xl hover:bg-${activity.color}-100 transition-colors cursor-pointer`}>
                    <div className={`w-8 h-8 bg-${activity.color}-500 rounded-full flex items-center justify-center`}>
                      <span className="text-white text-sm">
                        {activity.type === 'order' ? '✓' : activity.type === 'qr_scan' ? '📱' : '🍽️'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.details}</p>
                    </div>
                    <span className="text-xs text-gray-400">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">État du Système</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Backend API</span>
              </div>
              <span className="text-sm text-green-600 font-semibold">Connecté</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Base de données</span>
              </div>
              <span className="text-sm text-green-600 font-semibold">Opérationnelle</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">Temps réel</span>
              </div>
              <span className="text-sm text-blue-600 font-semibold">Socket.IO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}