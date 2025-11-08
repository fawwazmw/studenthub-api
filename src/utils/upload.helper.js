const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/avatars');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error, uploadPath);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename: userId-timestamp.ext
    const userId = req.user?.id || 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${userId}-${timestamp}${ext}`);
  }
});

// File filter - only accept images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
});

// Delete old avatar file
const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;
  
  try {
    // Extract filename from URL (e.g., /uploads/avatars/avatar-1-123456.jpg)
    const filename = path.basename(fileUrl);
    const filePath = path.join(__dirname, '../../uploads/avatars', filename);
    
    // Check if file exists and delete it
    await fs.access(filePath);
    await fs.unlink(filePath);
    console.log(`Deleted old avatar: ${filename}`);
  } catch (error) {
    // File doesn't exist or already deleted - not a critical error
    console.log(`Could not delete file: ${fileUrl}`, error.message);
  }
};

module.exports = {
  upload,
  deleteFile,
};
