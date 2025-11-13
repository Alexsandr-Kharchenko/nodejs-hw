import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import 'dotenv/config';
import helmet from 'helmet';

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

// ✅ Використовуємо логер
app.use(pinoHttp({ logger }));

// ✅ Підключаємо безпеку і парсинг
app.use(cors());
app.use(helmet());
app.use(express.json());

// ✅ Підключаємо маршрути
app.use('/notes', notesRoutes);

// ✅ Обробка 404
app.use(notFoundHandler);

// ✅ Обробка помилок
app.use(errorHandler);

// ✅ Підключаємо до бази
connectMongoDB(MONGO_URL).then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});
