const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  image: { url: String, public_id: String },
  excerpt: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  seoTitle: { type: String },
  seoDescription: { type: String },
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
