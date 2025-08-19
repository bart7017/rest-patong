'use client';

import { useState } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { initialCategories } from '@/data/initialData';
import { 
  PlusIcon,
  PhotoIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowLeftIcon,
  TagIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import AddCategoryModal from '@/components/AddCategoryModal';

interface Category {
  _id: string;
  name: {
    fr: string;
    en: string;
    th: string;
    ru: string;
    de: string;
  };
  description?: {
    fr: string;
    en: string;
    th: string;
    ru: string;
    de: string;
  };
  icon?: string;
  image?: string;
  order: number;
  isActive: boolean;
  dishCount?: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = usePersistedState<Category[]>('admin-categories', initialCategories);

  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [sortBy, setSortBy] = useState<'order' | 'name' | 'dishCount'>('order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const filteredAndSortedCategories = categories
    .filter(category => 
      category.name[selectedLanguage as keyof typeof category.name]
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'name') {
        aValue = a.name[selectedLanguage as keyof typeof a.name];
        bValue = b.name[selectedLanguage as keyof typeof b.name];
      } else if (sortBy === 'dishCount') {
        aValue = a.dishCount || 0;
        bValue = b.dishCount || 0;
      } else {
        aValue = a.order;
        bValue = b.order;
      }
      
      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : 1;
      }
      return aValue < bValue ? -1 : 1;
    });

  const handleAddCategory = (categoryData: any) => {
    const newCategory: Category = {
      _id: Date.now().toString(),
      ...categoryData,
      order: categories.length + 1,
      isActive: true,
      dishCount: 0
    };
    setCategories([...categories, newCategory]);
  };

  const handleEditCategory = (categoryData: any) => {
    if (!editingCategory) return;
    
    const updatedCategories = categories.map(cat => 
      cat._id === editingCategory._id 
        ? { ...cat, ...categoryData }
        : cat
    );
    setCategories(updatedCategories);
    setEditingCategory(null);
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories(categories.map(cat => 
      cat._id === id ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const deleteCategory = (id: string) => {
    const category = categories.find(cat => cat._id === id);
    const categoryName = category ? category.name[selectedLanguage as keyof typeof category.name] : 'cette catégorie';
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categoryName}" ?\n\nCette action est irréversible.`)) {
      setCategories(categories.filter(cat => cat._id !== id));
    }
  };

  const moveCategory = (id: string, direction: 'up' | 'down') => {
    const categoryIndex = categories.findIndex(cat => cat._id === id);
    if (categoryIndex === -1) return;
    
    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? categoryIndex - 1 : categoryIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < categories.length) {
      // Swap order values
      const temp = newCategories[categoryIndex].order;
      newCategories[categoryIndex].order = newCategories[targetIndex].order;
      newCategories[targetIndex].order = temp;
      
      // Swap positions
      [newCategories[categoryIndex], newCategories[targetIndex]] = 
      [newCategories[targetIndex], newCategories[categoryIndex]];
      
      setCategories(newCategories);
    }
  };

  const handleSort = (newSortBy: 'order' | 'name' | 'dishCount') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
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
              
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <TagIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Catégories</h1>
                <p className="text-sm text-gray-600">Organisez et gérez les catégories de votre menu</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Ajouter Catégorie</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Rechercher une catégorie..."
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Trier par:</span>
                <button
                  onClick={() => handleSort('order')}
                  className={`px-3 py-1 rounded text-sm ${
                    sortBy === 'order' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Ordre {sortBy === 'order' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('name')}
                  className={`px-3 py-1 rounded text-sm ${
                    sortBy === 'name' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Nom {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('dishCount')}
                  className={`px-3 py-1 rounded text-sm ${
                    sortBy === 'dishCount' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Plats {sortBy === 'dishCount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                {filteredAndSortedCategories.length} catégorie(s)
              </div>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          {filteredAndSortedCategories.map((category, index) => (
            <div 
              key={category._id} 
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md ${
                !category.isActive ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Icon & Order */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center text-2xl">
                      {category.icon || '📂'}
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500">Ordre</span>
                      <span className="text-sm font-semibold text-gray-700">{category.order}</span>
                    </div>
                  </div>
                  
                  {/* Category Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {category.name[selectedLanguage as keyof typeof category.name]}
                      </h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {category.isActive ? 'Actif' : 'Inactif'}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <EyeIcon className="h-4 w-4" />
                        <span>{category.dishCount} plats</span>
                      </div>
                    </div>
                    {category.description && (
                      <p className="text-sm text-gray-600">
                        {category.description[selectedLanguage as keyof typeof category.description]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {/* Move buttons */}
                  <div className="flex flex-col">
                    <button
                      onClick={() => moveCategory(category._id, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Monter"
                    >
                      <ArrowUpIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveCategory(category._id, 'down')}
                      disabled={index === filteredAndSortedCategories.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      title="Descendre"
                    >
                      <ArrowDownIcon className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Toggle status */}
                  <button
                    onClick={() => toggleCategoryStatus(category._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      category.isActive 
                        ? 'text-orange-600 hover:bg-orange-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={category.isActive ? 'Désactiver' : 'Activer'}
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  
                  {/* Edit */}
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  
                  {/* Delete */}
                  <button
                    onClick={() => deleteCategory(category._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                    disabled={category.dishCount! > 0}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune catégorie trouvée</h3>
            <p className="text-gray-600 mb-4">Créez votre première catégorie pour organiser votre menu</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Créer une catégorie
            </button>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCategory}
      />

      {/* Edit Category Modal */}
      {editingCategory && (
        <AddCategoryModal
          isOpen={true}
          onClose={() => setEditingCategory(null)}
          onSubmit={handleEditCategory}
          editingCategory={editingCategory}
        />
      )}
    </div>
  );
}