const notesRepository = require('./notes.repository');
const { deleteNoteFile } = require('../../utils/note_upload.helper');

const createNote = async (userId, noteData) => {
  return await notesRepository.create({
    userId,
    ...noteData,
  });
};

const getAllNotes = async (userId, filters = {}) => {
  const { category, search } = filters;
  
  const where = { userId };
  
  if (category) {
    where.category = category;
  }
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  return await notesRepository.findMany(where);
};

const getNoteById = async (userId, noteId) => {
  const note = await notesRepository.findById(noteId);
  
  if (!note) {
    const error = new Error('Note not found');
    error.statusCode = 404;
    throw error;
  }
  
  if (note.userId !== userId) {
    const error = new Error('Unauthorized access to this note');
    error.statusCode = 403;
    throw error;
  }
  
  return note;
};

const updateNote = async (userId, noteId, noteData) => {
  await getNoteById(userId, noteId); // Check ownership
  
  return await notesRepository.update(noteId, noteData);
};

const deleteNote = async (userId, noteId) => {
  const note = await getNoteById(userId, noteId); // Check ownership
  if (note.fileUrl) {
    await deleteNoteFile(note.fileUrl);
  }
  return await notesRepository.delete(noteId);
};

const attachNoteFile = async (userId, noteId, fileUrl) => {
  const note = await getNoteById(userId, noteId);
  if (note.fileUrl && note.fileUrl !== fileUrl) {
    await deleteNoteFile(note.fileUrl);
  }
  return await notesRepository.update(noteId, { fileUrl });
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  attachNoteFile,
};
