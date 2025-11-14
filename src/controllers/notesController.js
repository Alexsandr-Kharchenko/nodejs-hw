import Note from '../models/note.js';

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

    // Загальна кількість нотаток по фільтру
    const totalNotes = await Note.countDocuments(query);
    const totalPages = Math.ceil(totalNotes / perPage);

    // Вибірка нотаток
    const notes = await Note.find(query)
      .skip(skip)
      .limit(Number(perPage))
      .sort({ createdAt: -1 });

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
    if (!note) return res.status(404).json({ message: 'Note not found' });
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

    if (!updatedNote)
      return res.status(404).json({ message: 'Note not found' });
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
    if (!deletedNote)
      return res.status(404).json({ message: 'Note not found' });
    res.status(200).json(deletedNote);
  } catch (err) {
    next(err);
  }
};
