const express = require('express');
const router = express.Router();
const { getProducts, getAllProductsAdmin, getProductById, createProduct, updateProduct, deleteProduct, toggleFeatured, toggleVisible } = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/admin')
  .get(protect, admin, getAllProductsAdmin);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/toggle-featured')
  .patch(protect, admin, toggleFeatured);

router.route('/:id/toggle-visible')
  .patch(protect, admin, toggleVisible);

module.exports = router;
