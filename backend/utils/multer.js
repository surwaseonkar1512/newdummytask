const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({});

module.exports = multer({
  storage,
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.webp') {
      cb(new Error('File type is not supported'), false);
      return;
    }
    cb(null, true);
  }
});
