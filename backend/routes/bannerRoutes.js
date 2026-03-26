const express = require('express');
const router = express.Router();
const { getBanners, getAllBannersAdmin, getBannerById, createBanner, updateBanner, deleteBanner, toggleBannerStatus } = require('../controllers/bannerController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getBanners)
  .post(protect, admin, createBanner);

router.route('/admin')
  .get(protect, admin, getAllBannersAdmin);

router.route('/:id')
  .get(getBannerById)
  .put(protect, admin, updateBanner)
  .delete(protect, admin, deleteBanner);

router.route('/:id/toggle')
  .patch(protect, admin, toggleBannerStatus);

module.exports = router;
