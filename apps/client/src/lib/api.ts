const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003/api';

export interface Dish {
  _id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  price: {
    amount: number;
    currency: string;
    isPromotion?: boolean;
    originalPrice?: number;
  };
  images: string[];
  preparationTime?: number;
  dietary: {
    isVegetarian: boolean;
    isVegan: boolean;
    isSpicy: boolean;
    spicyLevel?: number;
  };
  tags: {
    isNew: boolean;
    isPopular: boolean;
    isChefSpecial: boolean;
  };
  category: string;
}

export interface Category {
  _id: string;
  name: Record<string, string>;
  description?: Record<string, string>;
  icon?: string;
  isActive: boolean;
}

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('Client API calling:', url);
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log('Client API response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Client API data for', endpoint, ':', data.length, 'items');
      return data;
    } catch (error) {
      console.error(`Client API Error for ${endpoint}:`, error);
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

  // Categories API
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const api = new ApiClient();