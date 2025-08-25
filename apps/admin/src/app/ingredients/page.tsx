'use client';

import { useState, useEffect } from 'react';
import { usePersistedState } from '@/hooks/usePersistedState';
import { initialIngredients } from '@/data/initialData';
import { 
  PlusIcon,
  PhotoIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowLeftIcon,
  HomeIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Ingredient {
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
  image?: string;
  category: string;
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

export default function IngredientsPage() {
  const [ingredients, setIngredients] = usePersistedState<Ingredient[]>('admin-ingredients', initialIngredients);

  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  const [formData, setFormData] = useState({
    name: { fr: '', en: '', th: '', ru: '', de: '' },
    description: { fr: '', en: '', th: '', ru: '', de: '' },
    category: 'other',
    price: { amount: 0, currency: 'THB' },
    image: null as File | null,
    isActive: true,
    allergens: {
      gluten: false,
      dairy: false,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    }
  });

  // Initialiser le formulaire avec les données de l'ingrédient à modifier
  useEffect(() => {
    if (editingIngredient) {
      setFormData({
        name: editingIngredient.name || { fr: '', en: '', th: '', ru: '', de: '' },
        description: editingIngredient.description || { fr: '', en: '', th: '', ru: '', de: '' },
        category: editingIngredient.category || 'other',
        price: editingIngredient.price || { amount: 0, currency: 'THB' },
        image: null,
        isActive: editingIngredient.isActive !== undefined ? editingIngredient.isActive : true,
        allergens: editingIngredient.allergens || {
          gluten: false,
          dairy: false,
          eggs: false,
          nuts: false,
          shellfish: false,
          soy: false,
          fish: false,
          peanuts: false,
        }
      });
      setShowAddModal(true);
    }
  }, [editingIngredient]);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const categories = [
    { value: 'all', label: 'Toutes les catégories', icon: '🔍' },
    { value: 'vegetable', label: 'Légumes', icon: '🥬' },
    { value: 'meat', label: 'Viandes', icon: '🥩' },
    { value: 'seafood', label: 'Fruits de mer', icon: '🦐' },
    { value: 'spice', label: 'Épices', icon: '🌶️' },
    { value: 'herb', label: 'Herbes', icon: '🌿' },
    { value: 'dairy', label: 'Produits laitiers', icon: '🥛' },
    { value: 'grain', label: 'Céréales', icon: '🌾' },
    { value: 'fruit', label: 'Fruits', icon: '🍎' },
    { value: 'sauce', label: 'Sauces', icon: '🥄' },
    { value: 'side', label: 'Accompagnements', icon: '🍟' },
    { value: 'other', label: 'Autres', icon: '📦' }
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

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name[selectedLanguage as keyof typeof ingredient.name]
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ingredient.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingIngredient) {
      // Mode modification
      const updatedIngredients = ingredients.map(ingredient => 
        ingredient._id === editingIngredient._id 
          ? { 
              ...ingredient, 
              ...formData,
              image: formData.image ? URL.createObjectURL(formData.image) : ingredient.image
            }
          : ingredient
      );
      setIngredients(updatedIngredients);
      setEditingIngredient(null);
    } else {
      // Mode ajout
      const newIngredient: Ingredient = {
        _id: Date.now().toString(),
        ...formData,
        image: formData.image ? URL.createObjectURL(formData.image) : undefined
      };
      setIngredients([...ingredients, newIngredient]);
    }
    
    resetForm();
    setShowAddModal(false);
  };

  const resetForm = () => {
    setFormData({
      name: { fr: '', en: '', th: '', ru: '', de: '' },
      description: { fr: '', en: '', th: '', ru: '', de: '' },
      category: 'other',
      price: { amount: 0, currency: 'THB' },
      image: null,
      isActive: true,
      allergens: {
        gluten: false,
        dairy: false,
        eggs: false,
        nuts: false,
        shellfish: false,
        soy: false,
        fish: false,
        peanuts: false,
      }
    });
    setEditingIngredient(null);
  };

  const toggleIngredientStatus = (id: string) => {
    setIngredients(ingredients.map(ingredient => 
      ingredient._id === id ? { ...ingredient, isActive: !ingredient.isActive } : ingredient
    ));
  };

  const deleteIngredient = (id: string) => {
    const ingredient = ingredients.find(ing => ing._id === id);
    const ingredientName = ingredient ? ingredient.name[selectedLanguage as keyof typeof ingredient.name] : 'cet ingrédient';
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'ingrédient "${ingredientName}" ?\n\nCette action est irréversible.`)) {
      setIngredients(ingredients.filter(ing => ing._id !== id));
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
                <span className="text-sm font-medium">Retour</span>
              </Link>
              
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🥬</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Ingrédients</h1>
                <p className="text-sm text-gray-600">Gérez la base d'ingrédients pour vos plats</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Ajouter Ingrédient</span>
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Rechercher un ingrédient..."
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.icon} {category.label}
                  </option>
                ))}
              </select>
              
              <div className="text-sm text-gray-600">
                {filteredIngredients.length} ingrédient(s)
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredIngredients.map(ingredient => (
            <div key={ingredient._id} className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow ${
              !ingredient.isActive ? 'opacity-60' : ''
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  {ingredient.image ? (
                    <img 
                      src={ingredient.image} 
                      alt={ingredient.name[selectedLanguage as keyof typeof ingredient.name]}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-xl">
                      {categories.find(c => c.value === ingredient.category)?.icon || '📦'}
                    </span>
                  )}
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => toggleIngredientStatus(ingredient._id)}
                    className={`p-1 rounded transition-colors ${
                      ingredient.isActive 
                        ? 'text-orange-600 hover:bg-orange-50' 
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={ingredient.isActive ? 'Désactiver' : 'Activer'}
                  >
                    {ingredient.isActive ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setEditingIngredient(ingredient)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteIngredient(ingredient._id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-1">
                {ingredient.name[selectedLanguage as keyof typeof ingredient.name]}
              </h3>
              
              {ingredient.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {ingredient.description[selectedLanguage as keyof typeof ingredient.description]}
                </p>
              )}

              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-green-600">
                  +{ingredient.price?.amount || 0}฿
                </span>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {categories.find(c => c.value === ingredient.category)?.label}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Prix personnalisation</span>
                
                <div className="flex space-x-1">
                  {Object.entries(ingredient.allergens)
                    .filter(([_, value]) => value)
                    .map(([key, _]) => {
                      const allergen = allergensList.find(a => a.key === key);
                      return allergen ? (
                        <span key={key} className="text-xs" title={allergen.label}>
                          {allergen.icon}
                        </span>
                      ) : null;
                    })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredIngredients.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🥬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun ingrédient trouvé</h3>
            <p className="text-gray-600 mb-4">Essayez de modifier vos critères de recherche</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Ajouter votre premier ingrédient
            </button>
          </div>
        )}
      </div>

      {/* Add Ingredient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingIngredient ? 'Modifier l\'Ingrédient' : 'Ajouter un Ingrédient'}
                </h3>
                <button
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Language selector for form */}
              <div className="flex space-x-2 mb-4">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedLanguage === lang.code
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {lang.flag} {lang.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom ({languages.find(l => l.code === selectedLanguage)?.name})
                    </label>
                    <input
                      type="text"
                      value={formData.name[selectedLanguage as keyof typeof formData.name]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        name: { ...prev.name, [selectedLanguage]: e.target.value }
                      }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: Crevettes, Citron vert..."
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description ({languages.find(l => l.code === selectedLanguage)?.name})
                    </label>
                    <textarea
                      value={formData.description[selectedLanguage as keyof typeof formData.description]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        description: { ...prev.description, [selectedLanguage]: e.target.value }
                      }))}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Description de l'ingrédient..."
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    >
                      {categories.slice(1).map(category => (
                        <option key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Prix */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix personnalisation (฿)
                    </label>
                    <input
                      type="number"
                      value={formData.price.amount}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        price: { ...prev.price, amount: Number(e.target.value) }
                      }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: 25"
                      min="0"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Prix ajouté quand le client sélectionne cet ingrédient
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photo de l'ingrédient
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.files?.[0] || null }))}
                        className="hidden"
                        id="ingredient-image-upload"
                      />
                      <label
                        htmlFor="ingredient-image-upload"
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <PhotoIcon className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Cliquez pour ajouter une image</span>
                      </label>
                      
                      {formData.image && (
                        <div className="mt-4 flex justify-center">
                          <div className="relative">
                            <img
                              src={URL.createObjectURL(formData.image)}
                              alt="Preview"
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, image: null }))}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <XMarkIcon className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Allergens */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allergènes
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {allergensList.map(allergen => (
                        <label key={allergen.key} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.allergens[allergen.key as keyof typeof formData.allergens]}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              allergens: { ...prev.allergens, [allergen.key]: e.target.checked }
                            }))}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm">{allergen.icon} {allergen.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  {editingIngredient ? 'Sauvegarder' : 'Ajouter l\'Ingrédient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}