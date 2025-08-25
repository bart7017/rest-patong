const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

export interface Dish {
  _id: string;
  name: {
    fr: string;
    en: string;
    th: string;
    ru: string;
    de: string;
  };
  description: {
    fr: string;
    en: string;
    th: string;
    ru: string;
    de: string;
  };
  category: string;
  categoryName?: string;
  price: {
    amount: number;
    currency: string;
  };
  images: string[];
  ingredients: string[];
  tags: {
    isNew: boolean;
    isPopular: boolean;
    isChefSpecial: boolean;
    isSeasonal: boolean;
    isLimitedTime: boolean;
  };
  dietary: {
    isVegetarian: boolean;
    isVegan: boolean;
    isSpicy: boolean;
    spicyLevel: number;
  };
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
  isCustomizable: boolean;
  customizableIngredients: string[];
  hasExtras: boolean;
  extraIngredients: string[];
  hasSides: boolean;
  sideOptions: string[];
  hasSauces: boolean;
  sauceOptions: string[];
  includedSauces: string[];
  includedSaucesCount: number;
  isActive: boolean;
  views?: number;
  order?: number;
  preparationTime?: number;
}

export interface Category {
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
  icon?: string;
  order: number;
  isActive: boolean;
  dishCount?: number;
}

export interface Ingredient {
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

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (endpoint === '/dishes') {
        console.log(`Admin API: Got ${Array.isArray(data) ? data.length : 'non-array'} dishes from ${url}`);
      }
      return data;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Dishes API
  async getDishes(): Promise<Dish[]> {
    return this.request<Dish[]>('/dishes');
  }

  async getDish(id: string): Promise<Dish> {
    return this.request<Dish>(`/dishes/${id}`);
  }

  async createDish(dish: Omit<Dish, '_id'>): Promise<Dish> {
    return this.request<Dish>('/dishes', {
      method: 'POST',
      body: JSON.stringify(dish),
    });
  }

  async updateDish(id: string, dish: Partial<Dish>): Promise<Dish> {
    return this.request<Dish>(`/dishes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dish),
    });
  }

  async deleteDish(id: string): Promise<void> {
    return this.request<void>(`/dishes/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories API
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  async getCategory(id: string): Promise<Category> {
    return this.request<Category>(`/categories/${id}`);
  }

  async createCategory(category: Omit<Category, '_id'>): Promise<Category> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    return this.request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    return this.request<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Ingredients API
  async getIngredients(): Promise<Ingredient[]> {
    return this.request<Ingredient[]>('/ingredients');
  }

  async getIngredient(id: string): Promise<Ingredient> {
    return this.request<Ingredient>(`/ingredients/${id}`);
  }

  async createIngredient(ingredient: Omit<Ingredient, '_id'>): Promise<Ingredient> {
    return this.request<Ingredient>('/ingredients', {
      method: 'POST',
      body: JSON.stringify(ingredient),
    });
  }

  async updateIngredient(id: string, ingredient: Partial<Ingredient>): Promise<Ingredient> {
    return this.request<Ingredient>(`/ingredients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ingredient),
    });
  }

  async deleteIngredient(id: string): Promise<void> {
    return this.request<void>(`/ingredients/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  // Analytics API
  async getAnalytics(): Promise<any> {
    return this.request<any>('/analytics');
  }
}

export const api = new ApiClient();