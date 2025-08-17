import express from 'express';
import {
  getDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
  updateDishesOrder,
  toggleDishAvailability
} from '../controllers/dishController';
import { authenticate, authorize } from '../middleware/auth';
import { validateDish } from '../middleware/validation';

const router = express.Router();

router.get('/', getDishes);
router.get('/:id', getDishById);

router.use(authenticate);
router.post('/', authorize('admin', 'manager'), validateDish, createDish);
router.put('/order', authorize('admin', 'manager'), updateDishesOrder);
router.put('/:id', authorize('admin', 'manager'), validateDish, updateDish);
router.patch('/:id/toggle-availability', authorize('admin', 'manager', 'staff'), toggleDishAvailability);
router.delete('/:id', authorize('admin', 'manager'), deleteDish);

export default router;