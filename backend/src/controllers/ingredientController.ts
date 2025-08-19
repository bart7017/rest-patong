import { Request, Response } from 'express';
import { Ingredient } from '../models/Ingredient';
import { ApiResponse } from '@/types';

export const getIngredients = async (req: Request, res: Response) => {
  try {
    const { category, search, lang = 'fr' } = req.query;
    
    let query: any = { isActive: true };
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const ingredients = await Ingredient.find(query).sort({ [`name.${lang}`]: 1 });
    
    // Filter by search term if provided
    let filteredIngredients = ingredients;
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      filteredIngredients = ingredients.filter(ingredient =>
        Object.values(ingredient.name).some(name =>
          name.toLowerCase().includes(searchTerm)
        )
      );
    }
    
    const response: ApiResponse = {
      success: true,
      data: filteredIngredients,
      meta: {
        total: filteredIngredients.length
      }
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getIngredientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const ingredient = await Ingredient.findById(id);
    
    if (!ingredient) {
      return res.status(404).json({
        success: false,
        error: 'Ingredient not found'
      });
    }
    
    res.json({
      success: true,
      data: ingredient
    });
  } catch (error) {
    console.error('Error fetching ingredient:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const createIngredient = async (req: Request, res: Response) => {
  try {
    const ingredientData = req.body;
    
    // Validate required fields
    if (!ingredientData.name || !ingredientData.name.fr || !ingredientData.name.en) {
      return res.status(400).json({
        success: false,
        error: 'Name in French and English is required'
      });
    }
    
    const ingredient = new Ingredient(ingredientData);
    await ingredient.save();
    
    res.status(201).json({
      success: true,
      data: ingredient,
      message: 'Ingredient created successfully'
    });
  } catch (error) {
    console.error('Error creating ingredient:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const updateIngredient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const ingredient = await Ingredient.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!ingredient) {
      return res.status(404).json({
        success: false,
        error: 'Ingredient not found'
      });
    }
    
    res.json({
      success: true,
      data: ingredient,
      message: 'Ingredient updated successfully'
    });
  } catch (error) {
    console.error('Error updating ingredient:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const deleteIngredient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const ingredient = await Ingredient.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!ingredient) {
      return res.status(404).json({
        success: false,
        error: 'Ingredient not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Ingredient deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

export const getIngredientCategories = async (req: Request, res: Response) => {
  try {
    const categories = [
      { value: 'vegetable', label: 'Légumes', icon: '🥬' },
      { value: 'meat', label: 'Viandes', icon: '🥩' },
      { value: 'seafood', label: 'Fruits de mer', icon: '🦐' },
      { value: 'spice', label: 'Épices', icon: '🌶️' },
      { value: 'herb', label: 'Herbes', icon: '🌿' },
      { value: 'dairy', label: 'Produits laitiers', icon: '🥛' },
      { value: 'grain', label: 'Céréales', icon: '🌾' },
      { value: 'fruit', label: 'Fruits', icon: '🍎' },
      { value: 'sauce', label: 'Sauces', icon: '🥄' },
      { value: 'other', label: 'Autres', icon: '📦' }
    ];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching ingredient categories:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};