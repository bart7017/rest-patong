import mongoose, { Schema, Document } from 'mongoose';

export interface IDish extends Document {
  name: {
    fr: string;
    en: string;
    th: string;
  };
  description: {
    fr: string;
    en: string;
    th: string;
  };
  category: mongoose.Types.ObjectId;
  price: number;
  originalPrice?: number;
  images: string[];
  cloudinaryIds: string[];
  allergens: string[];
  dietaryInfo: {
    isVegan: boolean;
    isVegetarian: boolean;
    isGlutenFree: boolean;
    isSpicy: boolean;
  };
  tags: {
    isNew: boolean;
    isPopular: boolean;
    isPromo: boolean;
  };
  availability: {
    isAvailable: boolean;
    availableFrom?: string;
    availableTo?: string;
  };
  order: number;
  isActive: boolean;
}

const multilingualTextSchema = {
  fr: { type: String, required: true },
  en: { type: String, required: true },
  th: { type: String, required: true },
  ru: { type: String, required: true },
  de: { type: String, required: true }
};

const dishSchema = new Schema<IDish>({
  name: multilingualTextSchema,
  description: multilingualTextSchema,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  images: [{
    type: String
  }],
  cloudinaryIds: [{
    type: String
  }],
  allergens: [{
    type: String,
    enum: ['gluten', 'dairy', 'eggs', 'fish', 'shellfish', 'nuts', 'peanuts', 'soy', 'sesame']
  }],
  dietaryInfo: {
    isVegan: { type: Boolean, default: false },
    isVegetarian: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false },
    isSpicy: { type: Boolean, default: false }
  },
  tags: {
    isNew: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isPromo: { type: Boolean, default: false }
  },
  availability: {
    isAvailable: { type: Boolean, default: true },
    availableFrom: String,
    availableTo: String
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

dishSchema.index({ category: 1, isActive: 1 });
dishSchema.index({ 'tags.isNew': 1 });
dishSchema.index({ 'tags.isPopular': 1 });
dishSchema.index({ 'tags.isPromo': 1 });
dishSchema.index({ order: 1 });

export default mongoose.model<IDish>('Dish', dishSchema);