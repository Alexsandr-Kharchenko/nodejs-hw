import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { errors as celebrateErrors } from 'celebrate';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectMongoDB } from './db/connectMongoDB.js';

import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import userRoutes from './routes/userRoutes.js';

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

const app = express();

// ===== Middleware =====
app.use(logger);
app.use(cors({ credentials: true, origin: process.env.FRONTEND_DOMAIN }));
app.use(cookieParser());
app.use(express.json());

// ===== Routes =====
app.use(authRoutes);
app.use(notesRoutes);
app.use(userRoutes);

// ===== 404 handler (обовʼязково після маршрутів)
app.use(notFoundHandler);

// ===== Celebrate validation errors (після 404!)
app.use(celebrateErrors());

// ===== Global error handler (останній)
app.use(errorHandler);

// ===== MongoDB connection
connectMongoDB(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
