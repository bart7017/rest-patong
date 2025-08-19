import express from 'express';
import {
  getDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
  reorderDishes,
  toggleDishAvailability
} from '../controllers/dishController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getDishes);
router.get('/:id', getDishById);

// Protected routes (require authentication)
router.post('/', auth, createDish);
router.put('/:id', auth, updateDish);
router.delete('/:id', auth, deleteDish);
router.post('/reorder', auth, reorderDishes);
router.patch('/:id/toggle-availability', auth, toggleDishAvailability);

export default router;