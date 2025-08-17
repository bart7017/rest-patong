import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuAnalytics extends Document {
  _id: string;
  dishId: mongoose.Types.ObjectId;
  qrCodeId?: string;
  tableNumber?: string;
  sessionId: string; // Identifiant unique de session client
  
  // Actions utilisateur
  action: 'view' | 'search' | 'filter' | 'favorite' | 'share' | 'detail_view';
  
  // Contexte de l'action
  language: 'fr' | 'en' | 'th' | 'ru' | 'de';
  searchQuery?: string;
  filterUsed?: string[];
  viewDuration?: number; // en secondes
  
  // Informations temporelles
  timestamp: Date;
  dayOfWeek: number; // 0-6
  hourOfDay: number; // 0-23
  
  // Données techniques
  userAgent?: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  
  // Géolocalisation approximative (optionnel)
  location?: {
    country?: string;
    city?: string;
  };
  
  createdAt: Date;
}

const menuAnalyticsSchema = new Schema<IMenuAnalytics>(
  {
    dishId: {
      type: Schema.Types.ObjectId,
      ref: 'Dish',
      required: true,
    },
    qrCodeId: {
      type: String,
      trim: true,
    },
    tableNumber: {
      type: String,
      trim: true,
    },
    sessionId: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
      type: String,
      enum: ['view', 'search', 'filter', 'favorite', 'share', 'detail_view'],
      required: true,
    },
    language: {
      type: String,
      enum: ['fr', 'en', 'th', 'ru', 'de'],
      required: true,
    },
    searchQuery: {
      type: String,
      trim: true,
    },
    filterUsed: [{
      type: String,
      trim: true,
    }],
    viewDuration: {
      type: Number,
      min: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
    },
    hourOfDay: {
      type: Number,
      min: 0,
      max: 23,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    deviceType: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop'],
      default: 'mobile',
    },
    location: {
      country: { type: String, trim: true },
      city: { type: String, trim: true },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Index pour améliorer les performances des analytics
menuAnalyticsSchema.index({ dishId: 1, timestamp: -1 });
menuAnalyticsSchema.index({ action: 1, timestamp: -1 });
menuAnalyticsSchema.index({ language: 1, timestamp: -1 });
menuAnalyticsSchema.index({ qrCodeId: 1, timestamp: -1 });
menuAnalyticsSchema.index({ dayOfWeek: 1, hourOfDay: 1 });
menuAnalyticsSchema.index({ timestamp: -1 });

// Index composé pour requêtes complexes
menuAnalyticsSchema.index({ 
  dishId: 1, 
  action: 1, 
  language: 1, 
  timestamp: -1 
});

// TTL index pour supprimer les données anciennes (garde 1 an)
menuAnalyticsSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 });

// Middleware pour calculer dayOfWeek et hourOfDay automatiquement
menuAnalyticsSchema.pre('save', function(next) {
  if (!this.dayOfWeek) {
    this.dayOfWeek = this.timestamp.getDay();
  }
  if (!this.hourOfDay) {
    this.hourOfDay = this.timestamp.getHours();
  }
  next();
});

export const MenuAnalytics = mongoose.model<IMenuAnalytics>('MenuAnalytics', menuAnalyticsSchema);

// Interfaces pour les rapports analytics
export interface IDishPopularity {
  dishId: string;
  dishName: Record<string, string>;
  totalViews: number;
  uniqueViews: number;
  avgViewDuration: number;
  topLanguages: { language: string; count: number }[];
  trending: boolean;
}

export interface IMenuInsights {
  totalViews: number;
  uniqueSessions: number;
  avgSessionDuration: number;
  topDishes: IDishPopularity[];
  languageDistribution: { language: string; percentage: number }[];
  peakHours: { hour: number; views: number }[];
  searchTerms: { term: string; count: number }[];
  conversionFunnel: {
    views: number;
    detailViews: number;
    favorites: number;
    shares: number;
  };
}