import express from 'express';
import {
  getIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  getIngredientCategories
} from '../controllers/ingredientController';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getIngredients);
router.get('/categories', getIngredientCategories);
router.get('/:id', getIngredientById);

// Protected routes (require authentication)
router.post('/', auth, createIngredient);
router.put('/:id', auth, updateIngredient);
router.delete('/:id', auth, deleteIngredient);

export default router;