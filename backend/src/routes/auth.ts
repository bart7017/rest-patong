import express from 'express';
import { register, login, getProfile, updateProfile, changePassword } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateAuth } from '../middleware/validation';

const router = express.Router();

router.post('/register', validateAuth, register);
router.post('/login', validateAuth, login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

export default router;