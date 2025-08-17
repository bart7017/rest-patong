import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { uploadImage } from '../config/cloudinary';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.use(authenticate);
router.use(authorize('admin', 'manager'));

router.post('/single', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const result = await uploadImage(req.file.path, 'restaurant-patong');

    res.json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId
      },
      message: 'Image uploadée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/multiple', upload.array('images', 5), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    const uploadPromises = files.map(file => uploadImage(file.path, 'restaurant-patong'));
    const results = await Promise.all(uploadPromises);

    res.json({
      success: true,
      data: results,
      message: 'Images uploadées avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;