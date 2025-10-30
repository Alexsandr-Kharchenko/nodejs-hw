import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pino from 'pino-http';

dotenv.config();

const app = express();

//  Middleware
app.use(cors());
app.use(express.json());
app.use(pino());

// Маршрути

// GET /notes
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

// GET /notes/:noteId
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

// Middleware 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Middleware 500
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: err.message });
});

// GET /test-error
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
