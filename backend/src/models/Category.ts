import mongoose, { Document, Schema } from 'mongoose';
import { MultiLanguageText } from '@/types';

export interface ICategory extends Document {
  _id: string;
  name: MultiLanguageText;
  description?: MultiLanguageText;
  image?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  isAvailable: boolean;
  availabilitySchedule?: {
    startTime: string; // Format HH:mm
    endTime: string;   // Format HH:mm
    days: number[];    // 0-6 (Dimanche-Samedi)
  };
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
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
    icon: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    availabilitySchedule: {
      startTime: {
        type: String,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      },
      endTime: {
        type: String,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      },
      days: {
        type: [Number],
        validate: {
          validator: function(days: number[]) {
            return days.every(day => day >= 0 && day <= 6);
          },
          message: 'Days must be between 0-6 (Sunday-Saturday)',
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index pour améliorer les performances
categorySchema.index({ order: 1, isActive: 1 });
categorySchema.index({ isAvailable: 1 });
categorySchema.index({ 'name.fr': 'text', 'name.en': 'text', 'name.th': 'text', 'name.ru': 'text', 'name.de': 'text' });

// Méthode virtuelle pour vérifier la disponibilité selon l'horaire
categorySchema.virtual('isCurrentlyAvailable').get(function() {
  if (!this.isAvailable || !this.availabilitySchedule) {
    return this.isAvailable;
  }

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.toTimeString().slice(0, 5); // HH:mm format

  const schedule = this.availabilitySchedule;
  
  // Vérifier si aujourd'hui est dans les jours disponibles
  if (!schedule.days.includes(currentDay)) {
    return false;
  }

  // Vérifier si l'heure actuelle est dans la plage horaire
  return currentTime >= schedule.startTime && currentTime <= schedule.endTime;
});

export const Category = mongoose.model<ICategory>('Category', categorySchema);