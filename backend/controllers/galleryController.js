const Gallery = require('../models/Gallery');
const cloudinary = require('../utils/cloudinary');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'art_portfolio/gallery'
    });
    
    // Auto-save to gallery
    const newImage = await Gallery.create({
      imageUrl: result.secure_url,
      publicId: result.public_id
    });
    
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadImage, getGalleryImages };
