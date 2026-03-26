const express = require('express');
const router = express.Router();
const {
  createStory,
  getStories,
  getStory,
  updateStory,
  deleteStory
} = require('../controllers/storyController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, admin, createStory)
  .get(getStories);

router.route('/:idOrSlug')
  .get(getStory)
  .put(protect, admin, updateStory)
  .delete(protect, admin, deleteStory);

module.exports = router;
