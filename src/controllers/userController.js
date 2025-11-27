// src/controllers/userController.js
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const updateUserAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(createHttpError(400, 'No file uploaded'));
    }

    const buffer = req.file.buffer;
    let uploadResult;

    try {
      uploadResult = await saveFileToCloudinary(buffer);
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      return next(createHttpError(500, 'Failed to upload image'));
    }

    if (!uploadResult || !uploadResult.secure_url) {
      return next(createHttpError(500, 'Failed to upload image'));
    }

    const url = uploadResult.secure_url;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: url },
      { new: true },
    );

    return res.status(200).json({ url: updatedUser.avatar });
  } catch (err) {
    next(err);
  }
};
