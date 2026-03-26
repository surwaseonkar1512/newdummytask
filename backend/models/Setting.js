const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  logo: { url: String, public_id: String },
  siteName: { type: String, default: 'Art Portfolio' },
  seoTitle: { type: String, default: 'Art Portfolio & Custom Art' },
  seoDescription: { type: String, default: 'Discover beautiful soil art, statues, and miniatures.' },
  seoKeywords: { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String },
  contactAddress: { type: String },
  socialLinks: {
    instagram: { type: String },
    facebook: { type: String },
    youtube: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
