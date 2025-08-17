export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  createdAt: Date;
  updatedAt: Date;
}

export interface MultilingualText {
  fr: string;
  en: string;
  th: string;
  ru: string;
  de: string;
}

export interface Category {
  _id: string;
  name: MultilingualText;
  description?: MultilingualText;
  image?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Dish {
  _id: string;
  name: MultilingualText;
  description: MultilingualText;
  category: string | Category;
  price: number;
  originalPrice?: number;
  images: string[];
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
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  dish: string | Dish;
  quantity: number;
  notes?: string;
  price: number;
}

export interface Order {
  _id: string;
  tableNumber?: string;
  items: OrderItem[];
  totalAmount: number;
  currency: 'THB' | 'EUR' | 'USD';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled';
  customerInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  notes?: string;
  language: 'fr' | 'en' | 'th' | 'ru' | 'de';
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  date: string;
  orders: number;
  revenue: number;
  topDishes: Array<{
    dishId: string;
    name: string;
    count: number;
  }>;
  averageOrderValue: number;
  customerLanguages: {
    fr: number;
    en: number;
    th: number;
    ru: number;
    de: number;
  };
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}