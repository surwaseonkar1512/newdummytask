const mongoose = require('mongoose');

const cloudinaryImageSchema = new mongoose.Schema({
  url: String,
  publicId: String
}, { _id: false });

const aboutSchema = new mongoose.Schema({
  hero: {
    title: { type: String, required: [true, 'Hero title is required'] },
    subtitle: String,
    introText: String,
    backgroundImage: cloudinaryImageSchema
  },
  story: {
    heading: { type: String, required: [true, 'Story heading is required'] },
    paragraph: String,
    image: cloudinaryImageSchema
  },
  journey: [{
    title: String,
    description: String,
    image: cloudinaryImageSchema
  }],
  team: [{
    name: { type: String, required: [true, 'Team member name is required'] },
    role: String,
    thoughts: String,
    image: cloudinaryImageSchema,
    socialLinks: {
      linkedin: String,
      twitter: String,
      instagram: String
    }
  }],
  vision: {
    image: cloudinaryImageSchema,
    points: [String]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('About', aboutSchema);
