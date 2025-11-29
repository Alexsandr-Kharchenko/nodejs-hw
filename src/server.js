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
app.use(express.urlencoded({ extended: true }));

// ===== Routes WITHOUT prefixes (вимога ментора) =====
app.use(authRoutes); // шляхи визначені всередині authRoutes
app.use(notesRoutes); // шляхи визначені всередині notesRoutes
app.use(userRoutes); // шляхи визначені всередині userRoutes

// Celebrate validation errors
app.use(celebrateErrors());

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ===== MongoDB connection + server start =====
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
