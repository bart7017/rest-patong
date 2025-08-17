import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoriesOrder
} from '../controllers/categoryController';
import { authenticate, authorize } from '../middleware/auth';
import { validateCategory } from '../middleware/validation';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);

router.use(authenticate);
router.post('/', authorize('admin', 'manager'), validateCategory, createCategory);
router.put('/order', authorize('admin', 'manager'), updateCategoriesOrder);
router.put('/:id', authorize('admin', 'manager'), validateCategory, updateCategory);
router.delete('/:id', authorize('admin', 'manager'), deleteCategory);

export default router;