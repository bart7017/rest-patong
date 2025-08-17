import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, any>;
  errors?: Record<string, any>;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  console.error('❌ Erreur:', err);

  if (err.name === 'CastError') {
    const message = 'Ressource non trouvée';
    error = { name: 'CastError', message, statusCode: 404 } as CustomError;
  }

  if (err.code === 11000) {
    const message = 'Données dupliquées';
    error = { name: 'DuplicateField', message, statusCode: 400 } as CustomError;
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors || {}).map((val: any) => val.message).join(', ');
    error = { name: 'ValidationError', message, statusCode: 400 } as CustomError;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erreur serveur interne',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};