import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const multilingualSchema = Joi.object({
  fr: Joi.string().required(),
  en: Joi.string().required(),
  th: Joi.string().required(),
  ru: Joi.string().required(),
  de: Joi.string().required()
});

export const validateCategory = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: multilingualSchema.required(),
    description: multilingualSchema,
    order: Joi.number().integer().min(0),
    isActive: Joi.boolean()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      error: error.details[0].message
    });
  }
  next();
};

export const validateDish = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: multilingualSchema.required(),
    description: multilingualSchema.required(),
    category: Joi.string().required(),
    price: Joi.number().min(0).required(),
    originalPrice: Joi.number().min(0),
    allergens: Joi.array().items(Joi.string().valid(
      'gluten', 'dairy', 'eggs', 'fish', 'shellfish', 'nuts', 'peanuts', 'soy', 'sesame'
    )),
    dietaryInfo: Joi.object({
      isVegan: Joi.boolean(),
      isVegetarian: Joi.boolean(),
      isGlutenFree: Joi.boolean(),
      isSpicy: Joi.boolean()
    }),
    tags: Joi.object({
      isNew: Joi.boolean(),
      isPopular: Joi.boolean(),
      isPromo: Joi.boolean()
    }),
    availability: Joi.object({
      isAvailable: Joi.boolean(),
      availableFrom: Joi.string(),
      availableTo: Joi.string()
    }),
    order: Joi.number().integer().min(0),
    isActive: Joi.boolean()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      error: error.details[0].message
    });
  }
  next();
};

export const validateOrder = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    tableNumber: Joi.string(),
    items: Joi.array().items(
      Joi.object({
        dish: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        notes: Joi.string(),
        price: Joi.number().min(0).required()
      })
    ).min(1).required(),
    currency: Joi.string().valid('THB', 'EUR', 'USD'),
    customerInfo: Joi.object({
      name: Joi.string(),
      phone: Joi.string(),
      email: Joi.string().email()
    }),
    notes: Joi.string(),
    language: Joi.string().valid('fr', 'en', 'th', 'ru', 'de'),
    isPickup: Joi.boolean()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      error: error.details[0].message
    });
  }
  next();
};

export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().when('$isRegister', {
      is: true,
      then: Joi.required()
    }),
    role: Joi.string().valid('admin', 'manager', 'staff')
  });

  const { error } = schema.validate(req.body, { 
    context: { isRegister: req.path === '/register' }
  });
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      error: error.details[0].message
    });
  }
  next();
};