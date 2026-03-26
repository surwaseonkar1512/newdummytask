const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  slogan: { type: String },
  description: { type: String },
  image: { 
    url: { type: String, required: true },
    public_id: { type: String }
  },
  ctaText: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
