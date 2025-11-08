const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const NOTES_DIR = path.join(__dirname, '../../uploads/notes');

const ensureNotesDir = async () => {
  await fs.mkdir(NOTES_DIR, { recursive: true });
};

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await ensureNotesDir();
      cb(null, NOTES_DIR);
    } catch (error) {
      cb(error, NOTES_DIR);
    }
  },
  filename: (req, file, cb) => {
    const noteId = req.params?.id ?? 'note';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || '.sbn2';
    cb(null, `note-${noteId}-${timestamp}${ext}`);
  },
});

const noteFileFilter = (req, file, cb) => {
  // Allow Saber formats + generic binaries
  const allowedExtensions = ['.sbn2', '.sbn', '.sba', '.png', '.jpg', '.jpeg', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ext || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported note file type'));
  }
};

const noteUpload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
  },
  fileFilter: noteFileFilter,
});

const deleteNoteFile = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    const filename = path.basename(fileUrl);
    const filePath = path.join(NOTES_DIR, filename);
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (error) {
    console.log(`Could not delete note file ${fileUrl}: ${error.message}`);
  }
};

module.exports = {
  noteUpload,
  deleteNoteFile,
};
