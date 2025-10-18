const notesRepository = require('./notes.repository');

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
  await getNoteById(userId, noteId); // Check ownership
  
  return await notesRepository.delete(noteId);
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
