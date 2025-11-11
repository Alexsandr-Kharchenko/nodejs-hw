import express from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

const router = express.Router();

router.get('/note', getAllNotes);
router.get('/note/:noteId', getNoteById);
router.post('/note', createNote);
router.patch('/note/:noteId', updateNote);
router.delete('/note/:noteId', deleteNote);

export default router;
