const Story = require('../models/Story');

// @desc    Create a new story
// @route   POST /api/stories
// @access  Private/Admin
const createStory = async (req, res) => {
  try {
    const { title, slug } = req.body;
    const storyExists = await Story.findOne({ slug });
    if (storyExists) {
      return res.status(400).json({ message: 'A story with this slug already exists' });
    }

    const story = await Story.create(req.body);
    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get all stories
// @route   GET /api/stories
// @access  Public
const getStories = async (req, res) => {
  try {
    const { isPublished, isFeatured } = req.query;
    let query = {};
    
    // If user is not admin, only show published
    // Note: To truly protect this, we need auth logic, but for now we trust the query or enforce it if 'req.user' exists.
    // Assuming 'req.user.role === admin' passes the empty query. If they explicitly request published, we filter:
    if (isPublished !== undefined) query.isPublished = isPublished === 'true';
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

    const stories = await Story.find(query).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get story by ID or Slug
// @route   GET /api/stories/:idOrSlug
// @access  Public
const getStory = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let story;
    
    // Check if valid ObjectId
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      story = await Story.findById(idOrSlug);
    }
    
    // Fallback to slug search
    if (!story) {
      story = await Story.findOne({ slug: idOrSlug });
    }

    if (story) {
      res.json(story);
    } else {
      res.status(404).json({ message: 'Story not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update story
// @route   PUT /api/stories/:idOrSlug
// @access  Private/Admin
const updateStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.idOrSlug);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Slug duplication check on update
    if (req.body.slug && req.body.slug !== story.slug) {
      const slugExists = await Story.findOne({ slug: req.body.slug });
      if (slugExists) return res.status(400).json({ message: 'Slug already in use' });
    }

    const updatedStory = await Story.findByIdAndUpdate(req.params.idOrSlug, req.body, { new: true, runValidators: true });
    res.json(updatedStory);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Delete story
// @route   DELETE /api/stories/:idOrSlug
// @access  Private/Admin
const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.idOrSlug);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    
    await story.deleteOne();
    res.json({ message: 'Story removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createStory,
  getStories,
  getStory,
  updateStory,
  deleteStory
};
