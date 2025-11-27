import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('Only images allowed'));
  } else {
    cb(null, true);
  }
};

// Іменований експорт
export const uploadAvatarMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // максимум 2MB
});
