import express from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const analyticsController = new AnalyticsController();

// Routes publiques (pour le tracking côté client)
router.post('/track', analyticsController.trackInteraction.bind(analyticsController));

// Routes protégées (pour l'admin)
router.use(authenticateToken); // Toutes les routes suivantes nécessitent une authentification

router.get('/insights', analyticsController.getMenuInsights.bind(analyticsController));
router.get('/realtime', analyticsController.getRealtimeStats.bind(analyticsController));
router.get('/trends', analyticsController.getTrendAnalysis.bind(analyticsController));

export default router;