import express, { Request, Response } from 'express';
import QRCode from 'qrcode';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);
router.use(authorize('admin', 'manager'));

router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { tableNumber, baseUrl } = req.body;

    if (!tableNumber) {
      return res.status(400).json({
        success: false,
        message: 'Numéro de table requis'
      });
    }

    const menuUrl = `${baseUrl || 'http://localhost:3000'}/menu?table=${tableNumber}`;
    
    const qrCodeDataURL = await QRCode.toDataURL(menuUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    });

    res.json({
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        url: menuUrl,
        tableNumber
      },
      message: 'QR Code généré avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du QR code',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/generate-batch', async (req: Request, res: Response) => {
  try {
    const { tables, baseUrl } = req.body;

    if (!Array.isArray(tables) || tables.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Liste de tables requise'
      });
    }

    const qrCodePromises = tables.map(async (tableNumber: string) => {
      const menuUrl = `${baseUrl || 'http://localhost:3000'}/menu?table=${tableNumber}`;
      
      const qrCodeDataURL = await QRCode.toDataURL(menuUrl, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      });

      return {
        tableNumber,
        qrCode: qrCodeDataURL,
        url: menuUrl
      };
    });

    const qrCodes = await Promise.all(qrCodePromises);

    res.json({
      success: true,
      data: qrCodes,
      message: 'QR Codes générés avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération des QR codes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;