import createError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;
    if (!userId) {
      return next(createError(401, 'Unauthorized'));
    }

    const { page = 1, perPage = 10, tag, search } = req.query;

    const query = { userId };

    if (tag) {
      query.tag = tag;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(perPage);

    const [totalNotes, notes] = await Promise.all([
      Note.countDocuments(query),
      Note.find(query)
        .skip(skip)
        .limit(Number(perPage))
        .sort({ createdAt: -1 }),
    ]);

    const totalPages = Math.ceil(totalNotes / Number(perPage)) || 1;

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

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user && req.user._id;

    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
      return next(createError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const userId = req.user && req.user._id;

    if (!userId) {
      return next(createError(401, 'Unauthorized'));
    }

    const { title, content, tag } = req.body;

    const newNote = await Note.create({
      title,
      content,
      tag,
      userId,
    });

    res.status(201).json(newNote);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user && req.user._id;
    const { title, content, tag } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: noteId, userId },
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

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;
    const userId = req.user && req.user._id;

    const deletedNote = await Note.findOneAndDelete({
      _id: noteId,
      userId,
    });

    if (!deletedNote) {
      return next(createError(404, 'Note not found'));
    }

    res.status(200).json(deletedNote);
  } catch (err) {
    next(err);
  }
};
