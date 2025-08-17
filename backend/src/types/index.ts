// Types partagés pour le backend

export interface MultiLanguageText {
  fr: string;   // Français
  en: string;   // English
  th: string;   // ไทย (Thai)
  ru: string;   // Русский (Russian)
  de: string;   // Deutsch (German)
}

export interface PriceInfo {
  amount: number;
  currency: string; // THB, EUR, USD
  isPromotion?: boolean;
  originalPrice?: number;
  promotionEndDate?: Date;
}

export interface NutritionalInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

export interface AllergenInfo {
  gluten: boolean;
  dairy: boolean;
  eggs: boolean;
  nuts: boolean;
  shellfish: boolean;
  soy: boolean;
  fish: boolean;
  peanuts: boolean;
}

export interface DietaryInfo {
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isHalal: boolean;
  isSpicy: boolean;
  spicyLevel?: number; // 1-5
}

export interface OrderItem {
  dishId: string;
  quantity: number;
  specialInstructions?: string;
  customizations?: {
    [key: string]: string;
  };
}

export interface CustomerInfo {
  tableNumber?: string;
  customerName?: string;
  phoneNumber?: string;
  email?: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  SERVED = 'served',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

// Nouveau type pour les demandes d'assistance client
export interface WaiterCallRequest {
  tableNumber: string;
  qrCodeId?: string;
  requestType: 'order' | 'assistance' | 'bill' | 'complaint';
  message?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  language: 'fr' | 'en' | 'th' | 'ru' | 'de';
  timestamp: Date;
  status: 'pending' | 'acknowledged' | 'resolved';
  assignedTo?: string; // ID du staff
  resolvedAt?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  STAFF = 'staff'
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}