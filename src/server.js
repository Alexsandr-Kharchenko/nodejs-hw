import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import logger from './middleware/logger.js';
import notFoundHandler from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import connectMongoDB from './db/connectMongoDB.js';
import notesRoutes from './routes/notesRoutes.js';

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error('MONGO_URL is not defined in environment variables');
  process.exit(1);
}

const app = express();

// Middleware
app.use(logger);
app.use(express.json());
app.use(cors());

// Routes
app.use(notesRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Connect to DB & start server
const start = async () => {
  try {
    await connectMongoDB(MONGO_URL);
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();

export default app;
