import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import 'dotenv/config';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(pinoHttp());

// Маршрут для отримання всіх нотаток
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

// Маршрут для отримання нотатки за id
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

// Тестовий маршрут для імітації помилки
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// Middleware для обробки неіснуючих маршрутів (404)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Middleware для обробки помилок (500)

app.use((err, req, res, next) => {
  console.error(err);

  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ message: 'Oops! Something went wrong' });
  } else {
    res.status(500).json({ message: err.message, stack: err.stack });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
