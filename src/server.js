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
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

const app = express();

// Логування (через кастомний middleware)
app.use(logger);

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Маршрути (без префіксів!)
app.use(authRoutes);
app.use(notesRoutes);

// Celebrate errors
app.use(celebrateErrors());

// 404 handler
app.use(notFoundHandler);

// Глобальний error handler
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
