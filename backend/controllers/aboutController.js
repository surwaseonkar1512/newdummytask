const About = require('../models/About');

// @desc    Get the master About page document
// @route   GET /api/about
// @access  Public
const getAbout = async (req, res) => {
  try {
    const aboutData = await About.findOne();
    if (!aboutData) {
      // If none exists yet, return an empty template structure
      return res.json({
        hero: { title: 'About Our Studio', subtitle: '', introText: '' },
        story: { heading: 'Our Story', paragraph: '' },
        journey: [],
        team: [],
        vision: { points: [] }
      });
    }
    res.json(aboutData);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update or Create the master About page document
// @route   PUT /api/about
// @access  Private/Admin
const updateAbout = async (req, res) => {
  try {
    // Upsert pattern: update the single document, or create if it doesn't exist
    const aboutData = await About.findOneAndUpdate(
      {}, // no filter means match the first/only document
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    
    res.json(aboutData);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Update Error' });
  }
};

module.exports = {
  getAbout,
  updateAbout
};
