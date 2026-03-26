const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  thumbnail: {
    publicId: String,
    url: String
  },
  shortDescription: {
    type: String,
    required: true
  },
  location: {
    placeName: String,
    city: String,
    state: String,
    country: String
  },
  beforeImages: [{
    publicId: String,
    url: String
  }],
  afterImages: [{
    publicId: String,
    url: String
  }],
  processSteps: [{
    title: String,
    description: String
  }],
  contentBlocks: [{
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'bullet'],
      required: true
    },
    data: mongoose.Schema.Types.Mixed
  }],
  testimonial: {
    clientName: String,
    designation: String,
    message: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    }
  },
  galleryImages: [{
    publicId: String,
    url: String
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Story', storySchema);
