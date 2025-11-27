import express from 'express';
import { celebrate } from 'celebrate';

import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';

import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetEmail,
  resetPassword,
  uploadAvatar,
} from '../controllers/authController.js';

import { uploadAvatarMiddleware } from '../middleware/multer.js';

const router = express.Router();

// Базові маршрути
router.post('/register', celebrate(registerUserSchema), registerUser);
router.post('/login', celebrate(loginUserSchema), loginUser);
router.post('/refresh', refreshUserSession);
router.post('/logout', logoutUser);

// Reset password
router.post('/request-reset-email', requestResetEmail);
router.post('/reset-password', resetPassword);

// Upload avatar через auth
router.post(
  '/upload-avatar',
  uploadAvatarMiddleware.single('avatar'),
  uploadAvatar,
);

// Іменований експорт маршруту
export { router as authRoutes };
