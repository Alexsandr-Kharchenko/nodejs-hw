import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

import authenticate from '../middleware/authenticate.js';
import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = Router();

// застосуємо authenticate до всіх роутів в цьому роутері
router.use(authenticate);

// GET / → список нотаток користувача
router.get('/', celebrate(getAllNotesSchema), getAllNotes);

// GET /:noteId → конкретна нотатка
router.get('/:noteId', celebrate(noteIdSchema), getNoteById);

// POST / → створити нотатку
router.post('/', celebrate(createNoteSchema), createNote);

// PATCH /:noteId → редагувати нотатку
router.patch('/:noteId', celebrate(updateNoteSchema), updateNote);

// DELETE /:noteId → видалити нотатку
router.delete('/:noteId', celebrate(noteIdSchema), deleteNote);

export default router;
