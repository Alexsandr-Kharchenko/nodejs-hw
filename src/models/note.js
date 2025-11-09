import mongoose from 'mongoose';

const validTags = [
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
  'Ideas',
  'Travel',
  'Finance',
  'Health',
  'Important',
  'Todo',
];

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, trim: true, default: '' },
    tag: { type: String, enum: validTags, default: 'Todo' },
  },
  { timestamps: true },
);

const Note = mongoose.model('Note', noteSchema);

export default Note;
