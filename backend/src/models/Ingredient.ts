import mongoose, { Document, Schema } from 'mongoose';
import { MultiLanguageText } from '@/types';

export interface IIngredient extends Document {
  _id: string;
  name: MultiLanguageText;
  description?: MultiLanguageText;
  image?: string;
  category: 'vegetable' | 'meat' | 'seafood' | 'spice' | 'herb' | 'dairy' | 'grain' | 'fruit' | 'sauce' | 'other';
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
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ingredientSchema = new Schema<IIngredient>(
  {
    name: {
      fr: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
      th: { type: String, required: true, trim: true },
      ru: { type: String, required: true, trim: true },
      de: { type: String, required: true, trim: true },
    },
    description: {
      fr: { type: String, trim: true },
      en: { type: String, trim: true },
      th: { type: String, trim: true },
      ru: { type: String, trim: true },
      de: { type: String, trim: true },
    },
    image: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['vegetable', 'meat', 'seafood', 'spice', 'herb', 'dairy', 'grain', 'fruit', 'sauce', 'other'],
      required: true,
      default: 'other'
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
    nutritionalInfo: {
      calories: { type: Number, min: 0 },
      protein: { type: Number, min: 0 },
      carbs: { type: Number, min: 0 },
      fat: { type: Number, min: 0 },
      fiber: { type: Number, min: 0 },
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
ingredientSchema.index({ category: 1, isActive: 1 });
ingredientSchema.index({ 'name.fr': 'text', 'name.en': 'text', 'name.th': 'text', 'name.ru': 'text', 'name.de': 'text' });

export const Ingredient = mongoose.model<IIngredient>('Ingredient', ingredientSchema);