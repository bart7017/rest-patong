import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getOrdersByTable
} from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';
import { validateOrder } from '../middleware/validation';

const router = express.Router();

router.post('/', validateOrder, createOrder);
router.get('/table/:tableNumber', getOrdersByTable);

router.use(authenticate);
router.get('/', authorize('admin', 'manager', 'staff'), getOrders);
router.get('/:id', authorize('admin', 'manager', 'staff'), getOrderById);
router.put('/:id/status', authorize('admin', 'manager', 'staff'), updateOrderStatus);
router.delete('/:id', authorize('admin', 'manager'), cancelOrder);

export default router;