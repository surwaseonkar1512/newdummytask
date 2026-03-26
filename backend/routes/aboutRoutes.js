const express = require('express');
const router = express.Router();
const { getAbout, updateAbout } = require('../controllers/aboutController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getAbout)
  .put(protect, admin, updateAbout);

module.exports = router;
