import { Request, Response } from 'express';
import { JsonStorage } from '../storage/jsonStorage';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await JsonStorage.getCategories();
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const categoryData = req.body;
    
    // Validate required fields
    if (!categoryData.name || !categoryData.name.fr || !categoryData.name.en) {
      return res.status(400).json({
        success: false,
        error: 'Name in French and English is required'
      });
    }
    
    // If no order is specified, set it to the highest + 1
    if (!categoryData.order) {
      const maxOrderCategory = await Category.findOne().sort({ order: -1 });
      categoryData.order = maxOrderCategory ? maxOrderCategory.order + 1 : 1;
    }
    
    const category = new Category(categoryData);
    await category.save();
    
    res.status(201).json({
      success: true,
      data: category,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const category = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if there are dishes using this category
    const { Dish } = await import('../models/Dish');
    const dishCount = await Dish.countDocuments({ category: id, isActive: true });
    
    if (dishCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete category. ${dishCount} dish(es) are still using this category.`
      });
    }
    
    const category = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const reorderCategories = async (req: Request, res: Response) => {
  try {
    const { categoryOrders } = req.body; // Array of { id, order }
    
    if (!Array.isArray(categoryOrders)) {
      return res.status(400).json({
        success: false,
        error: 'categoryOrders must be an array'
      });
    }
    
    // Update all categories with new order
    const updatePromises = categoryOrders.map(({ id, order }) =>
      Category.findByIdAndUpdate(id, { order }, { new: true })
    );
    
    const updatedCategories = await Promise.all(updatePromises);
    
    res.json({
      success: true,
      data: updatedCategories,
      message: 'Categories reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering categories:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};