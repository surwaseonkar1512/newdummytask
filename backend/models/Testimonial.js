const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Client name is required']
  },
  designation: {
    type: String
  },
  company: {
    type: String
  },
  image: {
    url: String,
    publicId: String
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  testimonialText: {
    type: String,
    required: [true, 'Testimonial text is required']
  },
  location: {
    type: String
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
