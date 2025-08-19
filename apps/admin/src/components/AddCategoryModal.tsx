'use client';

import { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: any) => void;
  editingCategory?: any;
}

export default function AddCategoryModal({ isOpen, onClose, onSubmit, editingCategory }: AddCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: { fr: '', en: '', th: '', ru: '', de: '' },
    description: { fr: '', en: '', th: '', ru: '', de: '' },
    icon: '',
    image: null as File | null,
    order: 0
  });

  const [currentLanguage, setCurrentLanguage] = useState('fr');

  // Initialiser le formulaire avec les données de la catégorie à modifier
  useEffect(() => {
    if (editingCategory) {
      setFormData({
        name: editingCategory.name || { fr: '', en: '', th: '', ru: '', de: '' },
        description: editingCategory.description || { fr: '', en: '', th: '', ru: '', de: '' },
        icon: editingCategory.icon || '',
        image: editingCategory.image || null,
        order: editingCategory.order || 0
      });
    }
  }, [editingCategory]);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const categoryIcons = [
    '🍜', '🍛', '🍲', '🍣', '🍤', '🥗', '🍖', '🍗', '🐟', '🦀',
    '🍱', '🍝', '🍕', '🥙', '🌮', '🍔', '🍟', '🥖', '🧀', '🥩'
  ];

  const handleImageUpload = (file: File | null) => {
    setFormData(prev => ({ ...prev, image: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    // Reset form
    setFormData({
      name: { fr: '', en: '', th: '', ru: '', de: '' },
      description: { fr: '', en: '', th: '', ru: '', de: '' },
      icon: '',
      image: null,
      order: 0
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingCategory ? 'Modifier la Catégorie' : 'Ajouter une Catégorie'}
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

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la catégorie ({languages.find(l => l.code === currentLanguage)?.name})
            </label>
            <input
              type="text"
              value={formData.name[currentLanguage as keyof typeof formData.name]}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                name: { ...prev.name, [currentLanguage]: e.target.value }
              }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Ex: Entrées, Plats principaux..."
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
              placeholder="Description de la catégorie..."
            />
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icône de la catégorie
            </label>
            <div className="grid grid-cols-10 gap-2 mb-3">
              {categoryIcons.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, icon }))}
                  className={`p-2 text-xl border rounded-lg hover:bg-gray-50 transition-colors ${
                    formData.icon === icon ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Ou tapez un emoji personnalisé..."
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de la catégorie (optionnel)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                className="hidden"
                id="category-image-upload"
              />
              <label
                htmlFor="category-image-upload"
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
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageUpload(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordre d'affichage
            </label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="0"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Les catégories avec un ordre plus faible apparaîtront en premier
            </p>
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
              {editingCategory ? 'Sauvegarder' : 'Ajouter la Catégorie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}