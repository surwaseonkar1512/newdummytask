const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  type: { type: String, enum: ['text', 'image', 'video', 'bullet'], required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sku: { type: String, required: true, unique: true },
  productType: { type: String, enum: ['Fixed Price', 'Custom'], required: true, default: 'Fixed Price' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  
  thumbnail: { type: String, required: true },
  images: [{ type: String }], // Array of URLs
  
  shortDescription: { type: String },
  description: { type: String },
  
  sizes: [{
    label: { type: String },
    price: { type: Number },
    stock: { type: Number }
  }],
  
  specifications: [{
    key: { type: String },
    value: { type: String }
  }],
  
  contentBlocks: [blockSchema],
  
  installationGuide: { type: String },
  careInstructions: { type: String },
  isCustomizable: { type: Boolean, default: false },
  
  seoTitle: { type: String },
  seoDescription: { type: String },
  
  featured: { type: Boolean, default: false },
  recent: { type: Boolean, default: false },
  bestSeller: { type: Boolean, default: false },
  isVisible: { type: Boolean, default: true },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Published' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
