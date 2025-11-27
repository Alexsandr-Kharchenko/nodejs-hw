import express from 'express';
import { updateUserAvatar } from '../controllers/userController.js';
import { uploadAvatarMiddleware } from '../middleware/multer.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// PATCH /users/me/avatar
router.patch(
  '/me/avatar',
  authenticate,
  uploadAvatarMiddleware.single('avatar'),
  updateUserAvatar,
);

export { router as userRoutes };
