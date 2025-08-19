'use client';

import { useState } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { initialDishes, initialCategories, initialIngredients } from '@/data/initialData';
import { 
  PlusIcon,
  PhotoIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  FireIcon,
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import AddDishModal from '@/components/AddDishModal';

interface Dish {
  _id: string;
  name: {
    fr: string;
    en: string;
    th: string;
    ru: string;
    de: string;
  };
  description: {
    fr: string;
    en: string;
    th: string;
    ru: string;
    de: string;
  };
  category: string;
  categoryName?: string;
  price: {
    amount: number;
    currency: string;
  };
  images: string[];
  ingredients: string[];
  tags: {
    isNew: boolean;
    isPopular: boolean;
    isChefSpecial: boolean;
    isSeasonal: boolean;
    isLimitedTime: boolean;
  };
  dietary: {
    isVegetarian: boolean;
    isVegan: boolean;
    isSpicy: boolean;
    spicyLevel: number;
  };
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
  isCustomizable: boolean;
  customizableIngredients: string[];
  hasExtras: boolean;
  extraIngredients: string[];
  hasSides: boolean;
  sideOptions: string[];
  hasSauces: boolean;
  sauceOptions: string[];
  includedSauces: string[];
  includedSaucesCount: number;
  isActive: boolean;
  views: number;
  order: number;
}

interface Category {
  _id: string;
  name: {
    fr: string;
    en: string;
    th: string;
    ru: string;
    de: string;
  };
  icon?: string;
}

interface Ingredient {
  _id: string;
  name: {
    fr: string;
    en: string;
    th: string;
    ru: string;
    de: string;
  };
  image?: string;
  price?: {
    amount: number;
    currency: string;
  };
  isActive: boolean;
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

export default function DishesPage() {
  const [dishes, setDishes, dishesLoaded] = usePersistedState<Dish[]>('admin-dishes-v6-fresh', initialDishes);
  const [categories] = usePersistedState('admin-categories', initialCategories);
  const [ingredients] = usePersistedState('admin-ingredients', initialIngredients);

  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyActive, setShowOnlyActive] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const allergensList = [
    { key: 'gluten', label: 'Gluten', icon: '🌾' },
    { key: 'dairy', label: 'Lactose', icon: '🥛' },
    { key: 'eggs', label: 'Œufs', icon: '🥚' },
    { key: 'nuts', label: 'Noix', icon: '🥜' },
    { key: 'shellfish', label: 'Crustacés', icon: '🦐' },
    { key: 'soy', label: 'Soja', icon: '🫘' },
    { key: 'fish', label: 'Poisson', icon: '🐟' },
    { key: 'peanuts', label: 'Cacahuètes', icon: '🥜' },
  ];

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name[selectedLanguage as keyof typeof dish.name]
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    const matchesActiveFilter = !showOnlyActive || dish.isActive;
    
    return matchesSearch && matchesCategory && matchesActiveFilter;
  });

  const handleAddDish = (dishData: any) => {
    const newDish: Dish = {
      _id: Date.now().toString(),
      ...dishData,
      views: 0,
      order: dishes.length + 1,
      isActive: true
    };
    setDishes([...dishes, newDish]);
  };

  const handleEditDish = (dishData: any) => {
    if (!editingDish) return;
    
    const updatedDishes = dishes.map(dish => 
      dish._id === editingDish._id 
        ? { ...dish, ...dishData }
        : dish
    );
    setDishes(updatedDishes);
    setEditingDish(null);
  };

  const refreshData = () => {
    if (confirm('Êtes-vous sûr de vouloir actualiser les données ? Cela va recharger les dernières modifications.')) {
      // Clear all localStorage
      localStorage.clear();
      // Reload the page to get fresh data
      window.location.reload();
    }
  };

  const toggleDishStatus = (id: string) => {
    setDishes(dishes.map(dish => 
      dish._id === id ? { ...dish, isActive: !dish.isActive } : dish
    ));
  };

  const deleteDish = (id: string) => {
    const dish = dishes.find(d => d._id === id);
    const dishName = dish ? dish.name[selectedLanguage as keyof typeof dish.name] : 'ce plat';
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer le plat "${dishName}" ?\n\nCette action est irréversible.`)) {
      setDishes(dishes.filter(dish => dish._id !== id));
    }
  };

  const getTags = (dish: Dish) => {
    const tags = [];
    if (dish.tags.isNew) tags.push({ label: 'Nouveau', color: 'bg-green-100 text-green-700', icon: '🆕' });
    if (dish.tags.isPopular) tags.push({ label: 'Populaire', color: 'bg-red-100 text-red-700', icon: '🔥' });
    if (dish.tags.isChefSpecial) tags.push({ label: 'Chef', color: 'bg-purple-100 text-purple-700', icon: '👨‍🍳' });
    if (dish.tags.isSeasonal) tags.push({ label: 'Saison', color: 'bg-orange-100 text-orange-700', icon: '🌱' });
    if (dish.tags.isLimitedTime) tags.push({ label: 'Limité', color: 'bg-yellow-100 text-yellow-700', icon: '⏰' });
    return tags;
  };

  const getDietaryInfo = (dish: Dish) => {
    const dietary = [];
    if (dish.dietary.isVegetarian) dietary.push('🥬');
    if (dish.dietary.isVegan) dietary.push('🌱');
    if (dish.dietary.isSpicy) {
      const spice = '🌶️'.repeat(dish.dietary.spicyLevel);
      dietary.push(spice);
    }
    return dietary;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
              
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🍽️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Plats</h1>
                <p className="text-sm text-gray-600">Gérez votre menu et vos spécialités</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Ajouter Plat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Rechercher un plat..."
                />
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.icon} {category.name[selectedLanguage as keyof typeof category.name]}
                  </option>
                ))}
              </select>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyActive}
                  onChange={(e) => setShowOnlyActive(e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-600">Actifs uniquement</span>
              </label>
              
              <div className="text-sm text-gray-600">
                {filteredDishes.length} plat(s)
              </div>
            </div>
          </div>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDishes.map(dish => (
            <div 
              key={dish._id} 
              className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
                !dish.isActive ? 'opacity-60' : ''
              }`}
            >
              {/* Image placeholder */}
              <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                {dish.images.length > 0 ? (
                  <img 
                    src={dish.images[0]} 
                    alt={dish.name[selectedLanguage as keyof typeof dish.name]}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-6xl">🍽️</div>
                )}
              </div>
              
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {dish.name[selectedLanguage as keyof typeof dish.name]}
                      </h3>
                      {dish.isCustomizable && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200">
                          🎨 Personnalisable
                        </span>
                      )}
                      {dish.hasExtras && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
                          ➕ Extras
                        </span>
                      )}
                      {dish.hasSides && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full border border-purple-200">
                          🍟 Accompagnement
                        </span>
                      )}
                      {dish.hasSauces && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full border border-yellow-200">
                          🥄 Sauces
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {dish.description[selectedLanguage as keyof typeof dish.description]}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2">
                    <div className={`w-3 h-3 rounded-full ${dish.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                </div>
                
                {/* Price & Category */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {dish.price.amount}
                    </span>
                    <span className="text-sm text-gray-500">฿</span>
                  </div>
                  <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {dish.categoryName}
                  </span>
                </div>
                
                {/* Tags */}
                {getTags(dish).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {getTags(dish).map((tag, index) => (
                      <span key={index} className={`text-xs px-2 py-1 rounded-full ${tag.color}`}>
                        {tag.icon} {tag.label}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Dietary & Allergens */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    {getDietaryInfo(dish).map((info, index) => (
                      <span key={index} className="text-lg">{info}</span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {Object.entries(dish.allergens)
                      .filter(([_, value]) => value)
                      .slice(0, 3)
                      .map(([key, _]) => {
                        const allergen = allergensList.find(a => a.key === key);
                        return allergen ? (
                          <span key={key} className="text-sm" title={allergen.label}>
                            {allergen.icon}
                          </span>
                        ) : null;
                      })}
                  </div>
                </div>
                
                {/* Customizable ingredients preview */}
                {dish.isCustomizable && dish.customizableIngredients && dish.customizableIngredients.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs text-blue-600 mb-1">Options personnalisables:</div>
                    <div className="flex flex-wrap gap-1">
                      {dish.customizableIngredients.slice(0, 3).map(ingredientId => {
                        const ingredient = ingredients.find(ing => ing._id === ingredientId);
                        return ingredient ? (
                          <span key={ingredientId} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
                            {ingredient.name[selectedLanguage as keyof typeof ingredient.name]} +{ingredient.price?.amount || 0}฿
                          </span>
                        ) : null;
                      })}
                      {dish.customizableIngredients.length > 3 && (
                        <span className="text-xs text-blue-600">+{dish.customizableIngredients.length - 3} autres</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Extra ingredients preview */}
                {dish.hasExtras && dish.extraIngredients && dish.extraIngredients.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs text-green-600 mb-1">Extras disponibles:</div>
                    <div className="flex flex-wrap gap-1">
                      {dish.extraIngredients.slice(0, 3).map(ingredientId => {
                        const ingredient = ingredients.find(ing => ing._id === ingredientId);
                        return ingredient ? (
                          <span key={ingredientId} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">
                            {ingredient.name[selectedLanguage as keyof typeof ingredient.name]} +{ingredient.price?.amount || 0}฿
                          </span>
                        ) : null;
                      })}
                      {dish.extraIngredients.length > 3 && (
                        <span className="text-xs text-green-600">+{dish.extraIngredients.length - 3} autres</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Side options preview */}
                {dish.hasSides && dish.sideOptions && dish.sideOptions.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs text-purple-600 mb-1">Choix d'accompagnement:</div>
                    <div className="flex flex-wrap gap-1">
                      {dish.sideOptions.slice(0, 3).map(ingredientId => {
                        const ingredient = ingredients.find(ing => ing._id === ingredientId);
                        return ingredient ? (
                          <span key={ingredientId} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200">
                            {ingredient.name[selectedLanguage as keyof typeof ingredient.name]} +{ingredient.price?.amount || 0}฿
                          </span>
                        ) : null;
                      })}
                      {dish.sideOptions.length > 3 && (
                        <span className="text-xs text-purple-600">+{dish.sideOptions.length - 3} autres</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Sauce options preview */}
                {dish.hasSauces && (dish.includedSauces?.length > 0 || dish.sauceOptions?.length > 0) && (
                  <div className="mb-3">
                    {dish.includedSauces && dish.includedSauces.length > 0 && (
                      <div className="mb-2">
                        <div className="text-xs text-green-600 mb-1">
                          Sauces incluses ({dish.includedSaucesCount || 1} max):
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {dish.includedSauces.slice(0, 2).map(ingredientId => {
                            const ingredient = ingredients.find(ing => ing._id === ingredientId);
                            return ingredient ? (
                              <span key={ingredientId} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">
                                ✓ {ingredient.name[selectedLanguage as keyof typeof ingredient.name]}
                              </span>
                            ) : null;
                          })}
                          {dish.includedSauces.length > 2 && (
                            <span className="text-xs text-green-600">+{dish.includedSauces.length - 2} autres</span>
                          )}
                        </div>
                      </div>
                    )}
                    {dish.sauceOptions && dish.sauceOptions.length > 0 && (
                      <div>
                        <div className="text-xs text-yellow-600 mb-1">Sauces extras:</div>
                        <div className="flex flex-wrap gap-1">
                          {dish.sauceOptions.slice(0, 3).map(ingredientId => {
                            const ingredient = ingredients.find(ing => ing._id === ingredientId);
                            return ingredient ? (
                              <span key={ingredientId} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded border border-yellow-200">
                                {ingredient.name[selectedLanguage as keyof typeof ingredient.name]} +{ingredient.price?.amount || 0}฿
                              </span>
                            ) : null;
                          })}
                          {dish.sauceOptions.length > 3 && (
                            <span className="text-xs text-yellow-600">+{dish.sauceOptions.length - 3} autres</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <EyeIcon className="h-4 w-4" />
                    <span>{dish.views} vues</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>#{dish.order}</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    onClick={() => toggleDishStatus(dish._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      dish.isActive 
                        ? 'text-orange-600 hover:bg-orange-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={dish.isActive ? 'Désactiver' : 'Activer'}
                  >
                    {dish.isActive ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setEditingDish(dish)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    
                    <button
                      onClick={() => deleteDish(dish._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDishes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun plat trouvé</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Essayez de modifier vos critères de recherche' : 'Créez votre premier plat'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Ajouter un plat
            </button>
          </div>
        )}
      </div>

      {/* Add Dish Modal */}
      <AddDishModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddDish}
        categories={categories}
        ingredients={ingredients}
      />

      {/* Edit Dish Modal */}
      {editingDish && (
        <AddDishModal
          isOpen={true}
          onClose={() => setEditingDish(null)}
          onSubmit={handleEditDish}
          categories={categories}
          ingredients={ingredients}
          editingDish={editingDish}
        />
      )}
    </div>
  );
}