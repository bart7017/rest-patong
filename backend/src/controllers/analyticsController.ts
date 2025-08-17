import { Request, Response } from 'express';
import { MenuAnalytics, IDishPopularity, IMenuInsights } from '../models/MenuAnalytics';
import { Dish } from '../models/Dish';
import mongoose from 'mongoose';

export class AnalyticsController {
  // Enregistrer une interaction utilisateur
  public async trackInteraction(req: Request, res: Response): Promise<void> {
    try {
      const {
        dishId,
        action,
        language,
        sessionId,
        searchQuery,
        filterUsed,
        viewDuration,
        qrCodeId,
        tableNumber,
        userAgent,
        deviceType = 'mobile'
      } = req.body;

      const timestamp = new Date();
      
      const analytics = new MenuAnalytics({
        dishId,
        action,
        language,
        sessionId,
        searchQuery,
        filterUsed,
        viewDuration,
        qrCodeId,
        tableNumber,
        userAgent,
        deviceType,
        timestamp,
        dayOfWeek: timestamp.getDay(),
        hourOfDay: timestamp.getHours()
      });

      await analytics.save();

      res.status(201).json({
        success: true,
        message: 'Interaction enregistrée'
      });
    } catch (error) {
      console.error('Erreur tracking interaction:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de l\'enregistrement'
      });
    }
  }

  // Obtenir les insights du menu
  public async getMenuInsights(req: Request, res: Response): Promise<void> {
    try {
      const { 
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 jours par défaut
        endDate = new Date(),
        language 
      } = req.query;

      const matchStage: any = {
        timestamp: {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string)
        }
      };

      if (language) {
        matchStage.language = language;
      }

      // Statistiques générales
      const [
        totalViewsResult,
        uniqueSessionsResult,
        avgSessionDurationResult,
        topDishesResult,
        languageDistributionResult,
        peakHoursResult,
        searchTermsResult,
        conversionFunnelResult
      ] = await Promise.all([
        // Total des vues
        MenuAnalytics.countDocuments({
          ...matchStage,
          action: { $in: ['view', 'detail_view'] }
        }),

        // Sessions uniques
        MenuAnalytics.distinct('sessionId', matchStage),

        // Durée moyenne des sessions
        MenuAnalytics.aggregate([
          { $match: { ...matchStage, viewDuration: { $exists: true } } },
          {
            $group: {
              _id: null,
              avgDuration: { $avg: '$viewDuration' }
            }
          }
        ]),

        // Top plats
        this.getTopDishes(matchStage, 10),

        // Distribution des langues
        MenuAnalytics.aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: '$language',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } }
        ]),

        // Heures de pointe
        MenuAnalytics.aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: '$hourOfDay',
              views: { $sum: 1 }
            }
          },
          { $sort: { _id: 1 } }
        ]),

        // Termes de recherche
        MenuAnalytics.aggregate([
          {
            $match: {
              ...matchStage,
              action: 'search',
              searchQuery: { $exists: true, $ne: '' }
            }
          },
          {
            $group: {
              _id: '$searchQuery',
              count: { $sum: 1 }
            }
          },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]),

        // Funnel de conversion
        MenuAnalytics.aggregate([
          { $match: matchStage },
          {
            $group: {
              _id: '$action',
              count: { $sum: 1 }
            }
          }
        ])
      ]);

      const totalViews = totalViewsResult;
      const uniqueSessions = uniqueSessionsResult.length;
      const avgSessionDuration = avgSessionDurationResult[0]?.avgDuration || 0;

      // Calculer les pourcentages de distribution des langues
      const totalLanguageViews = languageDistributionResult.reduce((sum, lang) => sum + lang.count, 0);
      const languageDistribution = languageDistributionResult.map(lang => ({
        language: lang._id,
        percentage: Math.round((lang.count / totalLanguageViews) * 100),
        count: lang.count
      }));

      // Formater les heures de pointe
      const peakHours = peakHoursResult.map(hour => ({
        hour: hour._id,
        views: hour.views
      }));

      // Formater les termes de recherche
      const searchTerms = searchTermsResult.map(term => ({
        term: term._id,
        count: term.count
      }));

      // Calculer le funnel de conversion
      const funnelData = conversionFunnelResult.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as any);

      const conversionFunnel = {
        views: funnelData.view || 0,
        detailViews: funnelData.detail_view || 0,
        favorites: funnelData.favorite || 0,
        shares: funnelData.share || 0
      };

      const insights: IMenuInsights = {
        totalViews,
        uniqueSessions,
        avgSessionDuration: Math.round(avgSessionDuration / 60 * 100) / 100, // en minutes
        topDishes: topDishesResult,
        languageDistribution,
        peakHours,
        searchTerms,
        conversionFunnel
      };

      res.json({
        success: true,
        data: insights,
        period: {
          startDate,
          endDate
        }
      });
    } catch (error) {
      console.error('Erreur insights menu:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération des insights'
      });
    }
  }

  // Obtenir les plats les plus populaires
  private async getTopDishes(matchStage: any, limit: number = 10): Promise<IDishPopularity[]> {
    const topDishesAggregation = await MenuAnalytics.aggregate([
      {
        $match: {
          ...matchStage,
          action: { $in: ['view', 'detail_view'] }
        }
      },
      {
        $group: {
          _id: '$dishId',
          totalViews: { $sum: 1 },
          uniqueViews: { $addToSet: '$sessionId' },
          avgViewDuration: { $avg: '$viewDuration' },
          languages: {
            $push: '$language'
          }
        }
      },
      {
        $project: {
          dishId: '$_id',
          totalViews: 1,
          uniqueViews: { $size: '$uniqueViews' },
          avgViewDuration: 1,
          languages: 1
        }
      },
      { $sort: { totalViews: -1 } },
      { $limit: limit }
    ]);

    // Enrichir avec les informations des plats
    const dishIds = topDishesAggregation.map(item => item.dishId);
    const dishes = await Dish.find({ _id: { $in: dishIds } }).select('name');

    const dishMap = dishes.reduce((acc, dish) => {
      acc[dish._id.toString()] = dish;
      return acc;
    }, {} as any);

    return topDishesAggregation.map(item => {
      const dish = dishMap[item.dishId.toString()];
      
      // Calculer la distribution des langues pour ce plat
      const languageCounts = item.languages.reduce((acc: any, lang: string) => {
        acc[lang] = (acc[lang] || 0) + 1;
        return acc;
      }, {});

      const topLanguages = Object.entries(languageCounts)
        .map(([language, count]) => ({
          language,
          count: count as number
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      return {
        dishId: item.dishId.toString(),
        dishName: dish?.name || {},
        totalViews: item.totalViews,
        uniqueViews: item.uniqueViews,
        avgViewDuration: Math.round((item.avgViewDuration || 0) / 60 * 100) / 100,
        topLanguages,
        trending: item.totalViews > 100 // Simple logique de trending
      };
    });
  }

  // Obtenir les statistiques en temps réel
  public async getRealtimeStats(req: Request, res: Response): Promise<void> {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());

      const [
        todayViews,
        thisHourViews,
        activeSessions,
        topDishToday
      ] = await Promise.all([
        // Vues aujourd'hui
        MenuAnalytics.countDocuments({
          timestamp: { $gte: today },
          action: { $in: ['view', 'detail_view'] }
        }),

        // Vues cette heure
        MenuAnalytics.countDocuments({
          timestamp: { $gte: thisHour },
          action: { $in: ['view', 'detail_view'] }
        }),

        // Sessions actives (dernières 30 minutes)
        MenuAnalytics.distinct('sessionId', {
          timestamp: { $gte: new Date(Date.now() - 30 * 60 * 1000) }
        }),

        // Plat le plus vu aujourd'hui
        MenuAnalytics.aggregate([
          {
            $match: {
              timestamp: { $gte: today },
              action: { $in: ['view', 'detail_view'] }
            }
          },
          {
            $group: {
              _id: '$dishId',
              views: { $sum: 1 }
            }
          },
          { $sort: { views: -1 } },
          { $limit: 1 }
        ])
      ]);

      let topDishName = 'Aucun';
      if (topDishToday.length > 0) {
        const dish = await Dish.findById(topDishToday[0]._id).select('name');
        topDishName = dish?.name.fr || 'Plat inconnu';
      }

      res.json({
        success: true,
        data: {
          todayViews,
          thisHourViews,
          activeSessions: activeSessions.length,
          topDishToday: {
            name: topDishName,
            views: topDishToday[0]?.views || 0
          }
        }
      });
    } catch (error) {
      console.error('Erreur stats temps réel:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la récupération des statistiques'
      });
    }
  }

  // Obtenir l'analyse des tendances
  public async getTrendAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const { period = 'week' } = req.query; // day, week, month
      
      let daysBack = 7;
      if (period === 'day') daysBack = 1;
      if (period === 'month') daysBack = 30;

      const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
      const endDate = new Date();

      // Analyse des tendances par jour
      const dailyTrends = await MenuAnalytics.aggregate([
        {
          $match: {
            timestamp: { $gte: startDate, $lte: endDate },
            action: { $in: ['view', 'detail_view'] }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$timestamp' },
              month: { $month: '$timestamp' },
              day: { $dayOfMonth: '$timestamp' }
            },
            views: { $sum: 1 },
            uniqueSessions: { $addToSet: '$sessionId' }
          }
        },
        {
          $project: {
            date: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
                day: '$_id.day'
              }
            },
            views: 1,
            uniqueSessions: { $size: '$uniqueSessions' }
          }
        },
        { $sort: { date: 1 } }
      ]);

      res.json({
        success: true,
        data: {
          period,
          trends: dailyTrends
        }
      });
    } catch (error) {
      console.error('Erreur analyse tendances:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de l\'analyse des tendances'
      });
    }
  }
}