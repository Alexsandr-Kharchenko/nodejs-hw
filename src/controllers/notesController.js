import Note from '../models/note.js';
import createError from 'http-errors';

// GET /notes
export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const query = {};

    // Фільтр за тегом
    if (tag) {
      query.tag = tag;
    }

    // Текстовий пошук
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * perPage;

    // Паралельні запити замість послідовних
    const [totalNotes, notes] = await Promise.all([
      Note.countDocuments(query),
      Note.find(query)
        .skip(skip)
        .limit(Number(perPage))
        .sort({ createdAt: -1 }),
    ]);

    const totalPages = Math.ceil(totalNotes / perPage);

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages,
      notes,
    });
  } catch (err) {
    next(err);
  }
};

// GET /notes/:noteId
export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findById(noteId);

    if (!note) {
      return next(createError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

// POST /notes
export const createNote = async (req, res, next) => {
  try {
    const { title, content, tag } = req.body;
    const newNote = await Note.create({ title, content, tag });
    res.status(201).json(newNote);
  } catch (err) {
    next(err);
  }
};

// PATCH /notes/:noteId
export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const { title, content, tag } = req.body;

    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content, tag },
      { new: true, runValidators: true },
    );

    if (!updatedNote) {
      return next(createError(404, 'Note not found'));
    }

    res.status(200).json(updatedNote);
  } catch (err) {
    next(err);
  }
};

// DELETE /notes/:noteId
export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return next(createError(404, 'Note not found'));
    }

    res.status(200).json(deletedNote);
  } catch (err) {
    next(err);
  }
};
