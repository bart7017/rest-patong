import { Request, Response } from 'express';
import { Dish } from '../models/Dish';
import { Category } from '../models/Category';
import { Ingredient } from '../models/Ingredient';
import { ApiResponse } from '@/types';

export const getDishes = async (req: Request, res: Response) => {
  try {
    const { 
      category, 
      search, 
      lang = 'fr', 
      isActive = true, 
      page = 1, 
      limit = 20,
      sortBy = 'order',
      sortOrder = 'asc'
    } = req.query;
    
    let query: any = { isActive };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      const searchTerm = new RegExp(search as string, 'i');
      query.$or = [
        { [`name.${lang}`]: searchTerm },
        { [`description.${lang}`]: searchTerm }
      ];
    }
    
    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    const sortOptions: any = {};
    
    if (sortBy === 'name') {
      sortOptions[`name.${lang}`] = sortDirection;
    } else if (sortBy === 'price') {
      sortOptions['price.amount'] = sortDirection;
    } else {
      sortOptions[sortBy as string] = sortDirection;
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [dishes, total] = await Promise.all([
      Dish.find(query)
        .populate('category', 'name icon order')
        .populate('ingredients', 'name image allergens category')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Dish.countDocuments(query)
    ]);
    
    const response: ApiResponse = {
      success: true,
      data: dishes,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching dishes:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getDishById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const dish = await Dish.findById(id)
      .populate('category', 'name icon order')
      .populate('ingredients', 'name image allergens category');
    
    if (!dish) {
      return res.status(404).json({
        success: false,
        error: 'Dish not found'
      });
    }
    
    res.json({
      success: true,
      data: dish
    });
  } catch (error) {
    console.error('Error fetching dish:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const createDish = async (req: Request, res: Response) => {
  try {
    const dishData = req.body;
    
    // Validate required fields
    if (!dishData.name || !dishData.name.fr || !dishData.name.en) {
      return res.status(400).json({
        success: false,
        error: 'Name in French and English is required'
      });
    }
    
    if (!dishData.category) {
      return res.status(400).json({
        success: false,
        error: 'Category is required'
      });
    }
    
    // Verify category exists
    const category = await Category.findById(dishData.category);
    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category'
      });
    }
    
    // Verify ingredients exist if provided
    if (dishData.ingredients && dishData.ingredients.length > 0) {
      const ingredientCount = await Ingredient.countDocuments({
        _id: { $in: dishData.ingredients },
        isActive: true
      });
      
      if (ingredientCount !== dishData.ingredients.length) {
        return res.status(400).json({
          success: false,
          error: 'One or more ingredients are invalid'
        });
      }
    }
    
    // If no order is specified, set it to the highest + 1
    if (!dishData.order) {
      const maxOrderDish = await Dish.findOne({ category: dishData.category }).sort({ order: -1 });
      dishData.order = maxOrderDish ? maxOrderDish.order + 1 : 1;
    }
    
    const dish = new Dish(dishData);
    await dish.save();
    
    // Populate the response
    const populatedDish = await Dish.findById(dish._id)
      .populate('category', 'name icon order')
      .populate('ingredients', 'name image allergens category');
    
    res.status(201).json({
      success: true,
      data: populatedDish,
      message: 'Dish created successfully'
    });
  } catch (error) {
    console.error('Error creating dish:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const updateDish = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Verify category exists if being updated
    if (updateData.category) {
      const category = await Category.findById(updateData.category);
      if (!category) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category'
        });
      }
    }
    
    // Verify ingredients exist if being updated
    if (updateData.ingredients && updateData.ingredients.length > 0) {
      const ingredientCount = await Ingredient.countDocuments({
        _id: { $in: updateData.ingredients },
        isActive: true
      });
      
      if (ingredientCount !== updateData.ingredients.length) {
        return res.status(400).json({
          success: false,
          error: 'One or more ingredients are invalid'
        });
      }
    }
    
    const dish = await Dish.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('category', 'name icon order')
      .populate('ingredients', 'name image allergens category');
    
    if (!dish) {
      return res.status(404).json({
        success: false,
        error: 'Dish not found'
      });
    }
    
    res.json({
      success: true,
      data: dish,
      message: 'Dish updated successfully'
    });
  } catch (error) {
    console.error('Error updating dish:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const deleteDish = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const dish = await Dish.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!dish) {
      return res.status(404).json({
        success: false,
        error: 'Dish not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Dish deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting dish:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const reorderDishes = async (req: Request, res: Response) => {
  try {
    const { dishOrders } = req.body; // Array of { id, order }
    
    if (!Array.isArray(dishOrders)) {
      return res.status(400).json({
        success: false,
        error: 'dishOrders must be an array'
      });
    }
    
    // Update all dishes with new order
    const updatePromises = dishOrders.map(({ id, order }) =>
      Dish.findByIdAndUpdate(id, { order }, { new: true })
    );
    
    const updatedDishes = await Promise.all(updatePromises);
    
    res.json({
      success: true,
      data: updatedDishes,
      message: 'Dishes reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering dishes:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const toggleDishAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const dish = await Dish.findById(id);
    if (!dish) {
      return res.status(404).json({
        success: false,
        error: 'Dish not found'
      });
    }
    
    dish.availability.isAvailable = !dish.availability.isAvailable;
    await dish.save();
    
    res.json({
      success: true,
      data: dish,
      message: `Dish ${dish.availability.isAvailable ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error('Error toggling dish availability:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};