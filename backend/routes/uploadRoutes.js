const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloudinary');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'art_portfolio'
    });
    res.json({
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
