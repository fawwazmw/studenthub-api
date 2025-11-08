const notesService = require('./notes.service');
const { successResponse } = require('../../utils/response.helper');

const createNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteData = req.body;
    const note = await notesService.createNote(userId, noteData);
    return successResponse(res, 'Note created successfully', note, 201);
  } catch (error) {
    next(error);
  }
};

const getAllNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { category, search } = req.query;
    const notes = await notesService.getAllNotes(userId, { category, search });
    return successResponse(res, 'Notes retrieved successfully', notes);
  } catch (error) {
    next(error);
  }
};

const getNoteById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = parseInt(req.params.id);
    const note = await notesService.getNoteById(userId, noteId);
    return successResponse(res, 'Note retrieved successfully', note);
  } catch (error) {
    next(error);
  }
};

const updateNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = parseInt(req.params.id);
    const noteData = req.body;
    const note = await notesService.updateNote(userId, noteId, noteData);
    return successResponse(res, 'Note updated successfully', note);
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = parseInt(req.params.id);
    await notesService.deleteNote(userId, noteId);
    return successResponse(res, 'Note deleted successfully');
  } catch (error) {
    next(error);
  }
};

const uploadNoteFile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const noteId = parseInt(req.params.id);
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }
    const fileUrl = `/uploads/notes/${req.file.filename}`;
    const note = await notesService.attachNoteFile(userId, noteId, fileUrl);
    return successResponse(res, 'Note file uploaded successfully', note);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  uploadNoteFile,
};
