'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

interface Dish {
  _id: string
  name: Record<string, string>
  description: Record<string, string>
  price: number
  category: string
  images: string[]
  availability: { isAvailable: boolean }
  dietaryInfo: { isSpicy: boolean; isVegan: boolean }
  tags: { isPopular: boolean }
}

interface Category {
  _id: string
  name: Record<string, string>
  isActive: boolean
}

export default function InteractiveMenuPage() {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [categories, setCategories] = useState<Category[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [showCallWaiter, setShowCallWaiter] = useState(false)

  // Get current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'fr'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [categoriesRes, dishesRes] = await Promise.all([
        fetch('http://localhost:5000/api/categories'),
        fetch('http://localhost:5000/api/menu')
      ])
      
      const categoriesData = await categoriesRes.json()
      const dishesData = await dishesRes.json()
      
      setCategories(categoriesData.data || [])
      setDishes(dishesData.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const changeLanguage = (locale: string) => {
    const newPathname = pathname.replace(/^\/[^\/]+/, `/${locale}`)
    router.push(newPathname)
  }

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name[currentLocale]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dish.description[currentLocale]?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedFilter === 'all') return matchesSearch
    if (selectedFilter === 'vegetarian') return matchesSearch && dish.dietaryInfo.isVegan
    if (selectedFilter === 'spicy') return matchesSearch && dish.dietaryInfo.isSpicy
    if (selectedFilter === 'popular') return matchesSearch && dish.tags.isPopular
    
    return matchesSearch
  })

  const handleCallWaiter = () => {
    setShowCallWaiter(true)
    setTimeout(() => setShowCallWaiter(false), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-orange-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🏝️</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">{t('restaurant.name')}</h1>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <p className="text-sm text-gray-600 font-medium">{t('restaurant.location')}</p>
                </div>
              </div>
            </div>
            
            {/* Interactive Language Selector */}
            <div className="flex items-center space-x-1 bg-white rounded-full p-1 shadow-md">
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                    currentLocale === code ? 'bg-blue-100' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-lg">{flag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              <span>Menu Digital QR</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
              {t('restaurant.welcome')} à Patong ! 🌺
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Découvrez nos délicieuses spécialités thaïlandaises et internationales
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Search Bar */}
      <div className="max-w-md mx-auto px-4 mb-6">
        <div className="relative">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('menu.search')}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <span className="text-gray-400 text-xl">🔍</span>
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Interactive Filter Tags */}
      <div className="max-w-md mx-auto px-4 mb-8">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: '🍽️ Tous' },
            { id: 'vegetarian', label: '🌱 Végétarien' },
            { id: 'spicy', label: '🌶️ Épicé' },
            { id: 'popular', label: '⭐ Populaire' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all ${
                selectedFilter === filter.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:shadow-md'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Menu Categories */}
      <main className="max-w-md mx-auto px-4 pb-32">
        {categories.map(category => {
          const categoryDishes = filteredDishes.filter(dish => dish.category === category._id)
          
          if (categoryDishes.length === 0) return null

          return (
            <div key={category._id} className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  🍤 {category.name[currentLocale] || category.name.fr}
                </h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {categoryDishes.length} plats
                </span>
              </div>
              
              <div className="space-y-4">
                {categoryDishes.map(dish => (
                  <div
                    key={dish._id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
                    onClick={() => {
                      // Future: Open dish details modal
                      console.log('Dish clicked:', dish.name[currentLocale])
                    }}
                  >
                    <div className="flex">
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 text-lg">
                            {dish.name[currentLocale] || dish.name.fr}
                          </h4>
                          <span className="font-bold text-primary-600 text-xl">{dish.price} ฿</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                          {dish.description[currentLocale] || dish.description.fr}
                        </p>
                        <div className="flex items-center space-x-2">
                          {dish.dietaryInfo.isSpicy && (
                            <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              🌶️ Épicé
                            </span>
                          )}
                          {dish.dietaryInfo.isVegan && (
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              🌱 Vegan
                            </span>
                          )}
                          {dish.tags.isPopular && (
                            <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                              ⭐ Populaire
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-24 h-24 m-4 bg-gradient-to-br from-orange-300 to-red-400 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-3xl">🍜</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {filteredDishes.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun plat trouvé</h3>
            <p className="text-gray-600">Essayez un autre terme de recherche ou filtre</p>
          </div>
        )}
      </main>

      {/* Interactive Floating Call Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-4">
          <button
            onClick={handleCallWaiter}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span className="text-2xl">📞</span>
            <span className="text-lg">{t('restaurant.callWaiter')}</span>
          </button>
          <div className="text-center mt-2 space-y-1">
            <p className="text-xs text-gray-500">{t('restaurant.phone')}</p>
            <p className="text-xs font-medium text-primary-600">{t('restaurant.orderInfo')}</p>
          </div>
        </div>
      </div>

      {/* Call Waiter Notification */}
      {showCallWaiter && (
        <div className="fixed top-20 left-4 right-4 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-lg z-50 animate-bounce">
          <div className="text-center">
            <span className="text-2xl mb-2 block">✅</span>
            <p className="font-semibold">Serveur appelé avec succès !</p>
            <p className="text-sm opacity-90">Il arrivera dans quelques instants</p>
          </div>
        </div>
      )}
    </div>
  )
}