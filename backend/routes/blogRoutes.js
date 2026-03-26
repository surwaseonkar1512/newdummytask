const express = require('express');
const router = express.Router();
const { getBlogs, getAllBlogsAdmin, getBlogBySlug, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getBlogs)
  .post(protect, admin, createBlog);

router.route('/admin')
  .get(protect, admin, getAllBlogsAdmin);

router.route('/slug/:slug')
  .get(getBlogBySlug);

router.route('/:id')
  .put(protect, admin, updateBlog)
  .delete(protect, admin, deleteBlog);

module.exports = router;
