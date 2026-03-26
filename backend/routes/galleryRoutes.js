const express = require('express');
const router = express.Router();
const { uploadImage, getGalleryImages } = require('../controllers/galleryController');
const { protect, admin } = require('../middlewares/authMiddleware');
const upload = require('../utils/multer');

router.route('/')
  .get(protect, admin, getGalleryImages);

router.post('/upload', protect, admin, upload.single('image'), uploadImage);

module.exports = router;
