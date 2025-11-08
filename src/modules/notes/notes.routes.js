const express = require('express');
const router = express.Router();
const notesController = require('./notes.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validation.middleware');
const { createNoteSchema, updateNoteSchema } = require('./notes.validation');
const { noteUpload } = require('../../utils/note_upload.helper');

// All routes are protected
router.use(authMiddleware);

router.post('/', validate(createNoteSchema), notesController.createNote);
router.get('/', notesController.getAllNotes);
router.get('/:id', notesController.getNoteById);
router.put('/:id', validate(updateNoteSchema), notesController.updateNote);
router.delete('/:id', notesController.deleteNote);
router.post('/:id/file', noteUpload.single('file'), notesController.uploadNoteFile);

module.exports = router;
