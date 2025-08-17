// Utilitaire pour tracker les interactions utilisateur
export class MenuAnalytics {
  private sessionId: string;
  private apiUrl: string;

  constructor(apiUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001') {
    this.apiUrl = apiUrl;
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    // Générer un ID de session unique
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `session_${timestamp}_${random}`;
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  }

  // Tracker une vue de plat
  public async trackDishView(dishId: string, language: string, viewStartTime?: number): Promise<void> {
    try {
      const viewDuration = viewStartTime ? Math.round((Date.now() - viewStartTime) / 1000) : undefined;
      
      await this.sendAnalytics({
        dishId,
        action: 'view',
        language,
        viewDuration,
        sessionId: this.sessionId,
        deviceType: this.getDeviceType(),
        userAgent: navigator.userAgent,
        qrCodeId: this.getQRCodeId(),
        tableNumber: this.getTableNumber()
      });
    } catch (error) {
      console.warn('Erreur tracking vue plat:', error);
    }
  }

  // Tracker une recherche
  public async trackSearch(searchQuery: string, language: string): Promise<void> {
    try {
      await this.sendAnalytics({
        dishId: '', // Pas de plat spécifique pour une recherche
        action: 'search',
        language,
        searchQuery,
        sessionId: this.sessionId,
        deviceType: this.getDeviceType(),
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.warn('Erreur tracking recherche:', error);
    }
  }

  // Tracker l'utilisation d'un filtre
  public async trackFilter(filterUsed: string[], language: string): Promise<void> {
    try {
      await this.sendAnalytics({
        dishId: '', // Pas de plat spécifique pour un filtre
        action: 'filter',
        language,
        filterUsed,
        sessionId: this.sessionId,
        deviceType: this.getDeviceType(),
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.warn('Erreur tracking filtre:', error);
    }
  }

  // Tracker l'ajout aux favoris
  public async trackFavorite(dishId: string, language: string): Promise<void> {
    try {
      await this.sendAnalytics({
        dishId,
        action: 'favorite',
        language,
        sessionId: this.sessionId,
        deviceType: this.getDeviceType(),
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.warn('Erreur tracking favori:', error);
    }
  }

  // Tracker un partage
  public async trackShare(dishId: string, language: string): Promise<void> {
    try {
      await this.sendAnalytics({
        dishId,
        action: 'share',
        language,
        sessionId: this.sessionId,
        deviceType: this.getDeviceType(),
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.warn('Erreur tracking partage:', error);
    }
  }

  // Tracker une vue détaillée de plat
  public async trackDetailView(dishId: string, language: string, viewDuration?: number): Promise<void> {
    try {
      await this.sendAnalytics({
        dishId,
        action: 'detail_view',
        language,
        viewDuration,
        sessionId: this.sessionId,
        deviceType: this.getDeviceType(),
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.warn('Erreur tracking vue détaillée:', error);
    }
  }

  // Envoyer les données analytics au backend
  private async sendAnalytics(data: any): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/api/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // En mode silencieux pour ne pas perturber l'expérience utilisateur
      console.warn('Analytics non envoyées:', error);
    }
  }

  // Récupérer l'ID du QR code depuis l'URL
  private getQRCodeId(): string | undefined {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('qr') || undefined;
    }
    return undefined;
  }

  // Récupérer le numéro de table depuis l'URL
  private getTableNumber(): string | undefined {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('table') || undefined;
    }
    return undefined;
  }

  // Tracker le début d'une session de consultation
  public startSession(): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('menu_session_start', Date.now().toString());
    }
  }

  // Obtenir la durée de la session en cours
  public getSessionDuration(): number {
    if (typeof window !== 'undefined') {
      const startTime = sessionStorage.getItem('menu_session_start');
      if (startTime) {
        return Math.round((Date.now() - parseInt(startTime)) / 1000);
      }
    }
    return 0;
  }
}

// Instance globale pour l'application
export const analytics = new MenuAnalytics();