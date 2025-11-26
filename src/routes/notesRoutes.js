import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

import { authenticate } from '../middleware/authenticate.js';

import {
  getAllNotesSchema,
  noteIdSchema,
  createNoteSchema,
  updateNoteSchema,
} from '../validations/notesValidation.js';

const router = Router();

// GET /notes - отримати всі нотатки (автентифікація потрібна)
router.get('/notes', authenticate, celebrate(getAllNotesSchema), getAllNotes);

// GET /notes/:noteId - отримати конкретну нотатку
router.get(
  '/notes/:noteId',
  authenticate,
  celebrate(noteIdSchema),
  getNoteById,
);

// POST /notes - створити нотатку
router.post('/notes', authenticate, celebrate(createNoteSchema), createNote);

// PATCH /notes/:noteId - оновити нотатку
router.patch(
  '/notes/:noteId',
  authenticate,
  celebrate(updateNoteSchema),
  updateNote,
);

// DELETE /notes/:noteId - видалити нотатку
router.delete(
  '/notes/:noteId',
  authenticate,
  celebrate(noteIdSchema),
  deleteNote,
);

export default router;
