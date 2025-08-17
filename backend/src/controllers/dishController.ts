import { Request, Response } from 'express';
import Dish from '../models/Dish';
import { deleteImage } from '../config/cloudinary';

export const getDishes = async (req: Request, res: Response) => {
  try {
    const {
      category,
      isActive = 'true',
      isVegan,
      isVegetarian,
      isGlutenFree,
      isNew,
      isPopular,
      isPromo,
      search,
      page = '1',
      limit = '20'
    } = req.query;

    const filter: any = {};
    
    if (isActive !== 'all') {
      filter.isActive = isActive === 'true';
      filter['availability.isAvailable'] = true;
    }
    
    if (category) filter.category = category;
    if (isVegan === 'true') filter['dietaryInfo.isVegan'] = true;
    if (isVegetarian === 'true') filter['dietaryInfo.isVegetarian'] = true;
    if (isGlutenFree === 'true') filter['dietaryInfo.isGlutenFree'] = true;
    if (isNew === 'true') filter['tags.isNew'] = true;
    if (isPopular === 'true') filter['tags.isPopular'] = true;
    if (isPromo === 'true') filter['tags.isPromo'] = true;

    if (search) {
      filter.$or = [
        { 'name.fr': { $regex: search, $options: 'i' } },
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.th': { $regex: search, $options: 'i' } },
        { 'name.ru': { $regex: search, $options: 'i' } },
        { 'name.de': { $regex: search, $options: 'i' } },
        { 'description.fr': { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.th': { $regex: search, $options: 'i' } },
        { 'description.ru': { $regex: search, $options: 'i' } },
        { 'description.de': { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [dishes, total] = await Promise.all([
      Dish.find(filter)
        .populate('category')
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Dish.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: dishes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des plats',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getDishById = async (req: Request, res: Response) => {
  try {
    const dish = await Dish.findById(req.params.id).populate('category');
    
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Plat non trouvé'
      });
    }

    res.json({
      success: true,
      data: dish
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du plat',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const createDish = async (req: Request, res: Response) => {
  try {
    const dish = await Dish.create(req.body);
    await dish.populate('category');

    res.status(201).json({
      success: true,
      data: dish,
      message: 'Plat créé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du plat',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateDish = async (req: Request, res: Response) => {
  try {
    const dish = await Dish.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category');

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Plat non trouvé'
      });
    }

    res.json({
      success: true,
      data: dish,
      message: 'Plat mis à jour avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du plat',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteDish = async (req: Request, res: Response) => {
  try {
    const dish = await Dish.findById(req.params.id);
    
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Plat non trouvé'
      });
    }

    for (const cloudinaryId of dish.cloudinaryIds) {
      await deleteImage(cloudinaryId);
    }

    await Dish.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Plat supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du plat',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateDishesOrder = async (req: Request, res: Response) => {
  try {
    const { dishes } = req.body;

    if (!Array.isArray(dishes)) {
      return res.status(400).json({
        success: false,
        message: 'Format de données invalide'
      });
    }

    const updatePromises = dishes.map((dish: { id: string; order: number }) =>
      Dish.findByIdAndUpdate(dish.id, { order: dish.order })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Ordre des plats mis à jour avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'ordre',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const toggleDishAvailability = async (req: Request, res: Response) => {
  try {
    const dish = await Dish.findById(req.params.id);
    
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Plat non trouvé'
      });
    }

    dish.availability.isAvailable = !dish.availability.isAvailable;
    await dish.save();

    res.json({
      success: true,
      data: dish,
      message: `Plat ${dish.availability.isAvailable ? 'activé' : 'désactivé'} avec succès`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement de disponibilité',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};