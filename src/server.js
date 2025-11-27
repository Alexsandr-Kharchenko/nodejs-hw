import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { errors as celebrateErrors } from 'celebrate';

import logger from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectMongoDB } from './db/connectMongoDB.js';

import { authRoutes } from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import { userRoutes } from './routes/userRoutes.js';

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

const app = express();

app.use(logger);

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  }),
);

app.use(helmet());
app.use(cookieParser());

// Парсер JSON і form-data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -----------------------
   МАРШРУТИ
----------------------- */
app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);
app.use('/users', userRoutes);

// Celebrate errors
app.use(celebrateErrors());

// 404
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

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
