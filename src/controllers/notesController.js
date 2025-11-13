import Note from '../models/note.js';
import createHttpError from 'http-errors';

// GET /notes
export const getAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (err) {
    next(err);
  }
};

// GET /:noteId
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);
    if (!note) throw createHttpError(404, 'Note not found');
    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

// POST /
export const createNote = async (req, res, next) => {
  try {
    const { title, content, tag } = req.body;
    if (!title?.trim()) throw createHttpError(400, 'Title is required');

    const newNote = await Note.create({ title, content, tag });
    res.status(201).json(newNote);
  } catch (err) {
    next(err);
  }
};

// PATCH /:noteId
export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { title, content, tag } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content, tag },
      { new: true, runValidators: true },
    );

    if (!updatedNote) throw createHttpError(404, 'Note not found');
    res.status(200).json(updatedNote);
  } catch (err) {
    next(err);
  }
};

// DELETE /:noteId
export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) throw createHttpError(404, 'Note not found');
    res.status(200).json(deletedNote);
  } catch (err) {
    next(err);
  }
};
