import { Request, Response } from 'express';
import { JsonStorage } from '../storage/jsonStorage';

export const getDishes = async (req: Request, res: Response) => {
  try {
    const dishes = await JsonStorage.getDishes();
    
    res.json({
      success: true,
      data: dishes
    });
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
    const dish = await JsonStorage.getDish(id);
    
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
    
    const newDish = await JsonStorage.createDish(dishData);
    
    res.status(201).json({
      success: true,
      data: newDish,
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
    
    const updatedDish = await JsonStorage.updateDish(id, updateData);
    
    res.json({
      success: true,
      data: updatedDish,
      message: 'Dish updated successfully'
    });
  } catch (error) {
    console.error('Error updating dish:', error);
    if (error.message === 'Dish not found') {
      return res.status(404).json({
        success: false,
        error: 'Dish not found'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const deleteDish = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await JsonStorage.deleteDish(id);
    
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