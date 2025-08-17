import express, { Request, Response } from 'express';
import Order from '../models/Order';
import Dish from '../models/Dish';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin', 'manager'));

router.get('/overview', async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo } = req.query;
    
    const filter: any = {};
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom as string);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo as string);
    }

    const [
      totalOrders,
      totalRevenue,
      averageOrderValue,
      statusStats,
      languageStats
    ] = await Promise.all([
      Order.countDocuments({ ...filter, status: { $ne: 'cancelled' } }),
      
      Order.aggregate([
        { $match: { ...filter, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      
      Order.aggregate([
        { $match: { ...filter, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, avg: { $avg: '$totalAmount' } } }
      ]),
      
      Order.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      Order.aggregate([
        { $match: { ...filter, status: { $ne: 'cancelled' } } },
        { $group: { _id: '$language', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        averageOrderValue: averageOrderValue[0]?.avg || 0,
        statusStats,
        languageStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des analytics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/top-dishes', async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo, limit = '10' } = req.query;
    
    const matchFilter: any = { status: { $ne: 'cancelled' } };
    if (dateFrom || dateTo) {
      matchFilter.createdAt = {};
      if (dateFrom) matchFilter.createdAt.$gte = new Date(dateFrom as string);
      if (dateTo) matchFilter.createdAt.$lte = new Date(dateTo as string);
    }

    const topDishes = await Order.aggregate([
      { $match: matchFilter },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.dish',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.price' },
          dishName: { $first: '$items.dishSnapshot.name' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit as string) }
    ]);

    res.json({
      success: true,
      data: topDishes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des plats populaires',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/daily-stats', async (req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo } = req.query;
    
    const matchFilter: any = { status: { $ne: 'cancelled' } };
    if (dateFrom || dateTo) {
      matchFilter.createdAt = {};
      if (dateFrom) matchFilter.createdAt.$gte = new Date(dateFrom as string);
      if (dateTo) matchFilter.createdAt.$lte = new Date(dateTo as string);
    }

    const dailyStats = await Order.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: dailyStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques quotidiennes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/hourly-stats', async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    
    const targetDate = date ? new Date(date as string) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const hourlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formattedStats = Array.from({ length: 24 }, (_, hour) => {
      const stat = hourlyStats.find(s => s._id === hour);
      return {
        hour,
        orders: stat?.orders || 0,
        revenue: stat?.revenue || 0
      };
    });

    res.json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques horaires',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;