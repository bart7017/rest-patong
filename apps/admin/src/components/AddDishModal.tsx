'use client';

import { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface Category {
  _id: string;
  name: {
    fr: string;
    en: string;
    th: string;
    ru: string;
    de: string;
  };
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

interface AddDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dish: any) => void;
  categories: Category[];
  ingredients: Ingredient[];
  editingDish?: any; // Plat à modifier (optionnel)
}

export default function AddDishModal({ isOpen, onClose, onSubmit, categories, ingredients, editingDish }: AddDishModalProps) {
  const [formData, setFormData] = useState({
    name: { fr: '', en: '', th: '', ru: '', de: '' },
    description: { fr: '', en: '', th: '', ru: '', de: '' },
    category: '',
    ingredients: [] as string[],
    price: { amount: 0, currency: 'THB' },
    images: [] as File[],
    isCustomizable: false,
    customizableIngredients: [] as string[],
    hasExtras: false,
    extraIngredients: [] as string[],
    hasSides: false,
    sideOptions: [] as string[],
    hasSauces: false,
    sauceOptions: [] as string[],
    includedSauces: [] as string[],
    includedSaucesCount: 1,
    allergens: {
      gluten: false,
      dairy: false,
      eggs: false,
      nuts: false,
      shellfish: false,
      soy: false,
      fish: false,
      peanuts: false,
    },
    tags: {
      isNew: false,
      isPopular: false,
      isChefSpecial: false,
      isSeasonal: false,
      isLimitedTime: false,
    },
    dietary: {
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isHalal: false,
      isSpicy: false,
      spicyLevel: 0,
    }
  });

  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [searchIngredient, setSearchIngredient] = useState('');

  // Initialiser le formulaire avec les données du plat à modifier
  useEffect(() => {
    if (editingDish) {
      setFormData({
        name: editingDish.name || { fr: '', en: '', th: '', ru: '', de: '' },
        description: editingDish.description || { fr: '', en: '', th: '', ru: '', de: '' },
        category: editingDish.category || '',
        ingredients: editingDish.ingredients || [],
        price: editingDish.price || { amount: 0, currency: 'THB' },
        images: editingDish.images || [],
        isCustomizable: editingDish.isCustomizable || false,
        customizableIngredients: editingDish.customizableIngredients || [],
        hasExtras: editingDish.hasExtras || false,
        extraIngredients: editingDish.extraIngredients || [],
        hasSides: editingDish.hasSides || false,
        sideOptions: editingDish.sideOptions || [],
        hasSauces: editingDish.hasSauces || false,
        sauceOptions: editingDish.sauceOptions || [],
        includedSauces: editingDish.includedSauces || [],
        includedSaucesCount: editingDish.includedSaucesCount || 1,
        allergens: editingDish.allergens || {
          gluten: false,
          dairy: false,
          eggs: false,
          nuts: false,
          shellfish: false,
          soy: false,
          fish: false,
          peanuts: false,
        },
        tags: editingDish.tags || {
          isNew: false,
          isPopular: false,
          isChefSpecial: false,
          isSeasonal: false,
          isLimitedTime: false,
        },
        dietary: editingDish.dietary || {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false,
          isHalal: false,
          isSpicy: false,
          spicyLevel: 0,
        }
      });
    }
  }, [editingDish]);

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

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name[currentLanguage as keyof typeof ingredient.name]
      .toLowerCase()
      .includes(searchIngredient.toLowerCase()) && 
    ingredient.isActive
  );

  const extraIngredients = filteredIngredients.filter(ingredient => 
    ingredient.category !== 'side'
  );

  const sideIngredients = filteredIngredients.filter(ingredient => 
    ingredient.category === 'side'
  );

  const sauceIngredients = filteredIngredients.filter(ingredient => 
    ingredient.category === 'sauce'
  );

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...Array.from(files)]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const toggleIngredient = (ingredientId: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.includes(ingredientId)
        ? prev.ingredients.filter(id => id !== ingredientId)
        : [...prev.ingredients, ingredientId]
    }));
  };

  const toggleCustomizableIngredient = (ingredientId: string) => {
    setFormData(prev => ({
      ...prev,
      customizableIngredients: prev.customizableIngredients.includes(ingredientId)
        ? prev.customizableIngredients.filter(id => id !== ingredientId)
        : [...prev.customizableIngredients, ingredientId]
    }));
  };

  const toggleExtraIngredient = (ingredientId: string) => {
    setFormData(prev => ({
      ...prev,
      extraIngredients: prev.extraIngredients.includes(ingredientId)
        ? prev.extraIngredients.filter(id => id !== ingredientId)
        : [...prev.extraIngredients, ingredientId]
    }));
  };

  const toggleSideOption = (ingredientId: string) => {
    setFormData(prev => ({
      ...prev,
      sideOptions: prev.sideOptions.includes(ingredientId)
        ? prev.sideOptions.filter(id => id !== ingredientId)
        : [...prev.sideOptions, ingredientId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs requis
    if (!formData.name.fr || !formData.name.en) {
      alert('Le nom en français et en anglais est requis');
      return;
    }
    
    if (!formData.category) {
      alert('Veuillez sélectionner une catégorie');
      return;
    }
    
    if (!formData.price.amount || formData.price.amount <= 0) {
      alert('Veuillez entrer un prix valide');
      return;
    }
    
    console.log('Submitting dish data:', formData);
    
    onSubmit(formData);
    onClose();
    
    // Reset form
    setFormData({
      name: { fr: '', en: '', th: '', ru: '', de: '' },
      description: { fr: '', en: '', th: '', ru: '', de: '' },
      category: '',
      ingredients: [],
      price: { amount: 0, currency: 'THB' },
      images: [],
      isCustomizable: false,
      customizableIngredients: [],
      hasExtras: false,
      extraIngredients: [],
      hasSides: false,
      sideOptions: [],
      hasSauces: false,
      sauceOptions: [],
      includedSauces: [],
      includedSaucesCount: 1,
      allergens: {
        gluten: false,
        dairy: false,
        eggs: false,
        nuts: false,
        shellfish: false,
        soy: false,
        fish: false,
        peanuts: false,
      },
      tags: {
        isNew: false,
        isPopular: false,
        isChefSpecial: false,
        isSeasonal: false,
        isLimitedTime: false,
      },
      dietary: {
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isHalal: false,
        isSpicy: false,
        spicyLevel: 0,
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingDish ? 'Modifier le Plat' : 'Ajouter un Plat'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Language Selector */}
          <div className="flex space-x-2 mb-4">
            {languages.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setCurrentLanguage(lang.code)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentLanguage === lang.code
                    ? 'bg-orange-100 text-orange-700 border border-orange-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du plat ({languages.find(l => l.code === currentLanguage)?.name})
                </label>
                <input
                  type="text"
                  value={formData.name[currentLanguage as keyof typeof formData.name]}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    name: { ...prev.name, [currentLanguage]: e.target.value }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Ex: Tom Yum Kung"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description ({languages.find(l => l.code === currentLanguage)?.name})
                </label>
                <textarea
                  value={formData.description[currentLanguage as keyof typeof formData.description]}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description, [currentLanguage]: e.target.value }
                  }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Description détaillée du plat..."
                  required
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name[currentLanguage as keyof typeof category.name]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (฿)
                </label>
                <input
                  type="number"
                  value={formData.price.amount}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    price: { ...prev.price, amount: Number(e.target.value) }
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="220"
                  min="0"
                  required
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos du plat
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e.target.files)}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <PhotoIcon className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Cliquez pour ajouter des images</span>
                  </label>
                  
                  {formData.images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {formData.images.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Options de personnalisation */}
              <div className="space-y-4">
                {/* Plat personnalisable */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isCustomizable}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        isCustomizable: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      🎨 Plat entièrement personnalisable
                    </span>
                  </label>
                  {formData.isCustomizable && (
                    <div className="ml-6 mt-2 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600">
                        Le client compose entièrement son plat
                      </p>
                    </div>
                  )}
                </div>

                {/* Extras disponibles */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasExtras}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        hasExtras: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      ➕ Extras disponibles
                    </span>
                  </label>
                  {formData.hasExtras && (
                    <div className="ml-6 mt-2 p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-600">
                        Le client peut ajouter des extras (payants)
                      </p>
                    </div>
                  )}
                </div>

                {/* Choix d'accompagnement */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasSides}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        hasSides: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      🍟 Choix d'accompagnement
                    </span>
                  </label>
                  {formData.hasSides && (
                    <div className="ml-6 mt-2 p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-purple-600">
                        Le client choisit un accompagnement
                      </p>
                    </div>
                  )}
                </div>

                {/* Options de sauces */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hasSauces}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        hasSauces: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      🥄 Options de sauces
                    </span>
                  </label>
                  {formData.hasSauces && (
                    <div className="ml-6 mt-2 p-3 bg-yellow-50 rounded-lg space-y-2">
                      <p className="text-xs text-yellow-600">
                        Le client peut choisir des sauces extras
                      </p>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Nombre de sauces incluses:
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={formData.includedSaucesCount}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            includedSaucesCount: Number(e.target.value)
                          }))}
                          className="w-20 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-500"
                        />
                        <span className="text-xs text-gray-500 ml-2">sauce(s) gratuites</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingrédients de base
                </label>
                <input
                  type="text"
                  value={searchIngredient}
                  onChange={(e) => setSearchIngredient(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Rechercher un ingrédient..."
                />
                <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                  {filteredIngredients.map(ingredient => {
                    if (ingredient.category === 'side') return null;
                    
                    return (
                      <div key={ingredient._id} className="p-3 border-b border-gray-200">
                        <div className="flex items-center justify-between gap-4">
                          <div 
                            className={`flex items-center space-x-3 cursor-pointer flex-1 ${
                              formData.ingredients.includes(ingredient._id) ? 'text-orange-600' : ''
                            }`}
                            onClick={() => toggleIngredient(ingredient._id)}
                          >
                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                              {ingredient.image ? (
                                <img 
                                  src={ingredient.image} 
                                  alt={ingredient.name[currentLanguage as keyof typeof ingredient.name]}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <span className="text-xs">🥬</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <span className="text-sm">
                                {ingredient.name[currentLanguage as keyof typeof ingredient.name]}
                              </span>
                            </div>
                            {formData.ingredients.includes(ingredient._id) && (
                              <span className="text-orange-500">✓ Base</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {formData.isCustomizable && (
                              <button
                                type="button"
                                onClick={() => toggleCustomizableIngredient(ingredient._id)}
                                className={`px-2 py-1 text-xs rounded ${
                                  formData.customizableIngredients.includes(ingredient._id)
                                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {formData.customizableIngredients.includes(ingredient._id) ? '🎨' : '+🎨'}
                              </button>
                            )}
                            
                            {formData.hasExtras && (
                              <button
                                type="button"
                                onClick={() => toggleExtraIngredient(ingredient._id)}
                                className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                                  formData.extraIngredients.includes(ingredient._id)
                                    ? 'bg-green-100 text-green-700 border border-green-300'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {formData.extraIngredients.includes(ingredient._id) ? `➕ +${ingredient.price?.amount || 0}฿` : '+Extra'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Accompagnements */}
              {formData.hasSides && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🍟 Accompagnements disponibles
                  </label>
                  <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                    {sideIngredients.map(ingredient => (
                      <div key={ingredient._id} className="p-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                              {ingredient.image ? (
                                <img 
                                  src={ingredient.image} 
                                  alt={ingredient.name[currentLanguage as keyof typeof ingredient.name]}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <span className="text-xs">🍟</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <span className="text-sm">
                                {ingredient.name[currentLanguage as keyof typeof ingredient.name]}
                              </span>
                              <div className="text-xs text-gray-500">
                                +{ingredient.price?.amount || 0}฿
                              </div>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => toggleSideOption(ingredient._id)}
                            className={`px-2 py-1 text-xs rounded ${
                              formData.sideOptions.includes(ingredient._id)
                                ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {formData.sideOptions.includes(ingredient._id) ? '🍟 Option' : 'Ajouter'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sauces */}
              {formData.hasSauces && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🥄 Sauces disponibles
                  </label>
                  <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                    {sauceIngredients.map(ingredient => (
                      <div key={ingredient._id} className="p-3 border-b border-gray-200">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                              {ingredient.image ? (
                                <img 
                                  src={ingredient.image} 
                                  alt={ingredient.name[currentLanguage as keyof typeof ingredient.name]}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <span className="text-xs">🥄</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <span className="text-sm">
                                {ingredient.name[currentLanguage as keyof typeof ingredient.name]}
                              </span>
                              <div className="text-xs text-gray-500">
                                +{ingredient.price?.amount || 0}฿
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => toggleIncludedSauce(ingredient._id)}
                              className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                                formData.includedSauces.includes(ingredient._id)
                                  ? 'bg-green-100 text-green-700 border border-green-300'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {formData.includedSauces.includes(ingredient._id) ? '✓ Incluse' : 'Incluse'}
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => toggleSauceOption(ingredient._id)}
                              className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                                formData.sauceOptions.includes(ingredient._id)
                                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {formData.sauceOptions.includes(ingredient._id) ? '🥄 Extra' : '+Extra'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm">{allergen.icon} {allergen.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="space-y-2">
                  {Object.entries(formData.tags).map(([key, value]) => (
                    <label key={key} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          tags: { ...prev.tags, [key]: e.target.checked }
                        }))}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm capitalize">
                        {key === 'isNew' && '🆕 Nouveau'}
                        {key === 'isPopular' && '🔥 Populaire'}
                        {key === 'isChefSpecial' && '👨‍🍳 Spécialité Chef'}
                        {key === 'isSeasonal' && '🌱 Saisonnier'}
                        {key === 'isLimitedTime' && '⏰ Temps Limité'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dietary Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Régimes spéciaux
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.dietary.isVegetarian}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        dietary: { ...prev.dietary, isVegetarian: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm">🥬 Végétarien</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.dietary.isVegan}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        dietary: { ...prev.dietary, isVegan: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm">🌱 Végan</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.dietary.isSpicy}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        dietary: { ...prev.dietary, isSpicy: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm">🌶️ Épicé</span>
                  </label>
                  {formData.dietary.isSpicy && (
                    <div className="ml-6">
                      <label className="block text-xs text-gray-600 mb-1">Niveau de piment (1-5)</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={formData.dietary.spicyLevel}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          dietary: { ...prev.dietary, spicyLevel: Number(e.target.value) }
                        }))}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-600 text-center">
                        {formData.dietary.spicyLevel}/5 🌶️
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {editingDish ? 'Sauvegarder' : 'Ajouter le Plat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}