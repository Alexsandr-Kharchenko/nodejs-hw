import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import 'dotenv/config';
import { errors as celebrateErrors } from 'celebrate';

import notFoundHandler from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import connectMongoDB from './db/connectMongoDB.js';
import notesRoutes from './routes/notesRoutes.js';

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

const app = express();

app.use(pinoHttp());
app.use(cors());
app.use(helmet());
app.use(express.json());

// Маршрути
app.use('/', notesRoutes);

// Celebrate validation errors
app.use(celebrateErrors());

// 404
app.use(notFoundHandler);

// Глобальний обробник помилок
app.use(errorHandler);

// Підключення до MongoDB і запуск сервера
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
