import { Request, Response } from 'express';
import Category from '../models/Category';
import { deleteImage } from '../config/cloudinary';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { isActive = 'true' } = req.query;
    
    const filter: any = {};
    if (isActive !== 'all') {
      filter.isActive = isActive === 'true';
    }

    const categories = await Category.find(filter).sort({ order: 1, createdAt: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la catégorie',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category,
      message: 'Catégorie créée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la catégorie',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    res.json({
      success: true,
      data: category,
      message: 'Catégorie mise à jour avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la catégorie',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Catégorie non trouvée'
      });
    }

    if (category.cloudinaryId) {
      await deleteImage(category.cloudinaryId);
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Catégorie supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la catégorie',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateCategoriesOrder = async (req: Request, res: Response) => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: 'Format de données invalide'
      });
    }

    const updatePromises = categories.map((cat: { id: string; order: number }) =>
      Category.findByIdAndUpdate(cat.id, { order: cat.order })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Ordre des catégories mis à jour avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'ordre',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};