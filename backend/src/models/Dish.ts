import mongoose, { Document, Schema } from 'mongoose';
import { MultiLanguageText, PriceInfo, NutritionalInfo, AllergenInfo, DietaryInfo } from '@/types';

export interface IDish extends Document {
  _id: string;
  name: MultiLanguageText;
  description: MultiLanguageText;
  shortDescription?: MultiLanguageText;
  category: mongoose.Types.ObjectId;
  price: PriceInfo;
  images: string[];
  preparationTime?: number; // en minutes
  servingSize?: number; // nombre de personnes
  nutritionalInfo?: NutritionalInfo;
  allergens: AllergenInfo;
  dietary: DietaryInfo;
  tags: {
    isNew: boolean;
    isPopular: boolean;
    isChefSpecial: boolean;
    isSeasonal: boolean;
    isLimitedTime: boolean;
  };
  availability: {
    isAvailable: boolean;
    stockQuantity?: number;
    dailyLimit?: number;
    soldToday?: number;
  };
  customizations?: {
    name: MultiLanguageText;
    options: {
      name: MultiLanguageText;
      priceModifier: number;
      isDefault?: boolean;
    }[];
    isRequired: boolean;
    maxSelections?: number;
  }[];
  rating?: {
    average: number;
    count: number;
  };
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const dishSchema = new Schema<IDish>(
  {
    name: {
      fr: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
      th: { type: String, required: true, trim: true },
      ru: { type: String, required: true, trim: true },
      de: { type: String, required: true, trim: true },
    },
    description: {
      fr: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
      th: { type: String, required: true, trim: true },
      ru: { type: String, required: true, trim: true },
      de: { type: String, required: true, trim: true },
    },
    shortDescription: {
      fr: { type: String, trim: true },
      en: { type: String, trim: true },
      th: { type: String, trim: true },
      ru: { type: String, trim: true },
      de: { type: String, trim: true },
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    price: {
      amount: { type: Number, required: true, min: 0 },
      currency: { type: String, default: 'THB' },
      isPromotion: { type: Boolean, default: false },
      originalPrice: { type: Number, min: 0 },
      promotionEndDate: { type: Date },
    },
    images: [{
      type: String,
      trim: true,
    }],
    preparationTime: {
      type: Number,
      min: 0,
      max: 180, // 3 heures max
    },
    servingSize: {
      type: Number,
      min: 1,
      default: 1,
    },
    nutritionalInfo: {
      calories: { type: Number, min: 0 },
      protein: { type: Number, min: 0 },
      carbs: { type: Number, min: 0 },
      fat: { type: Number, min: 0 },
      fiber: { type: Number, min: 0 },
    },
    allergens: {
      gluten: { type: Boolean, default: false },
      dairy: { type: Boolean, default: false },
      eggs: { type: Boolean, default: false },
      nuts: { type: Boolean, default: false },
      shellfish: { type: Boolean, default: false },
      soy: { type: Boolean, default: false },
      fish: { type: Boolean, default: false },
      peanuts: { type: Boolean, default: false },
    },
    dietary: {
      isVegetarian: { type: Boolean, default: false },
      isVegan: { type: Boolean, default: false },
      isGlutenFree: { type: Boolean, default: false },
      isHalal: { type: Boolean, default: false },
      isSpicy: { type: Boolean, default: false },
      spicyLevel: { type: Number, min: 0, max: 5 },
    },
    tags: {
      isNew: { type: Boolean, default: false },
      isPopular: { type: Boolean, default: false },
      isChefSpecial: { type: Boolean, default: false },
      isSeasonal: { type: Boolean, default: false },
      isLimitedTime: { type: Boolean, default: false },
    },
    availability: {
      isAvailable: { type: Boolean, default: true },
      stockQuantity: { type: Number, min: 0 },
      dailyLimit: { type: Number, min: 0 },
      soldToday: { type: Number, default: 0, min: 0 },
    },
    customizations: [{
      name: {
        fr: { type: String, required: true, trim: true },
        en: { type: String, required: true, trim: true },
        th: { type: String, required: true, trim: true },
        ru: { type: String, required: true, trim: true },
        de: { type: String, required: true, trim: true },
      },
      options: [{
        name: {
          fr: { type: String, required: true, trim: true },
          en: { type: String, required: true, trim: true },
          th: { type: String, required: true, trim: true },
          ru: { type: String, required: true, trim: true },
          de: { type: String, required: true, trim: true },
        },
        priceModifier: { type: Number, default: 0 },
        isDefault: { type: Boolean, default: false },
      }],
      isRequired: { type: Boolean, default: false },
      maxSelections: { type: Number, min: 1 },
    }],
    rating: {
      average: { type: Number, min: 0, max: 5, default: 0 },
      count: { type: Number, default: 0, min: 0 },
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances
dishSchema.index({ category: 1, isActive: 1, 'availability.isAvailable': 1 });
dishSchema.index({ order: 1 });
dishSchema.index({ 'price.amount': 1 });
dishSchema.index({ 'dietary.isVegetarian': 1 });
dishSchema.index({ 'dietary.isVegan': 1 });
dishSchema.index({ 'dietary.isSpicy': 1 });
dishSchema.index({ 'tags.isPopular': 1 });
dishSchema.index({ 'tags.isNew': 1 });
dishSchema.index({ 'name.fr': 'text', 'name.en': 'text', 'name.th': 'text', 'name.ru': 'text', 'name.de': 'text' });

// Méthode virtuelle pour le prix effectif
dishSchema.virtual('effectivePrice').get(function() {
  if (this.price.isPromotion && this.price.promotionEndDate && this.price.promotionEndDate > new Date()) {
    return this.price.amount;
  }
  return this.price.originalPrice || this.price.amount;
});

// Méthode virtuelle pour vérifier la disponibilité complète
dishSchema.virtual('isFullyAvailable').get(function() {
  if (!this.isActive || !this.availability.isAvailable) {
    return false;
  }
  
  // Vérifier les limites de stock
  if (this.availability.stockQuantity !== undefined && this.availability.stockQuantity <= 0) {
    return false;
  }
  
  // Vérifier les limites quotidiennes
  if (this.availability.dailyLimit !== undefined && 
      this.availability.soldToday !== undefined &&
      this.availability.soldToday >= this.availability.dailyLimit) {
    return false;
  }
  
  return true;
});

// Middleware pour valider les promotions
dishSchema.pre('save', function(next) {
  if (this.price.isPromotion) {
    if (!this.price.originalPrice || this.price.originalPrice <= this.price.amount) {
      return next(new Error('Original price must be greater than promotion price'));
    }
    if (!this.price.promotionEndDate || this.price.promotionEndDate <= new Date()) {
      return next(new Error('Promotion end date must be in the future'));
    }
  }
  next();
});

export const Dish = mongoose.model<IDish>('Dish', dishSchema);