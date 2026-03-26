const Product = require('../models/Product');

const generateSKU = () => {
  const uniqueId = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PRD-${Date.now().toString().slice(-4)}-${uniqueId}`;
};

const getProducts = async (req, res) => {
  try {
    const { category, featured, recent, bestSeller, search } = req.query;
    let query = { isVisible: true, status: 'Published' };

    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (recent === 'true') query.recent = true;
    if (bestSeller === 'true') query.bestSeller = true;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).populate('category', 'name slug');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find({}).populate('category', 'name slug').sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  const data = req.body;
  try {
    // Slug generation
    let finalSlug = data.slug;
    if (!finalSlug) finalSlug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const existing = await Product.findOne({ slug: finalSlug });
    if (existing) finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 8)}`;
    
    data.slug = finalSlug;

    // SKU generation
    if (!data.sku) data.sku = generateSKU();

    const product = new Product(data);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  const data = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Validate slug uniqueness if changed
    if (data.slug && data.slug !== product.slug) {
      const existing = await Product.findOne({ slug: data.slug });
      if (existing && existing._id.toString() !== product._id.toString()) {
        data.slug = `${data.slug}-${Math.random().toString(36).substring(2, 8)}`;
      }
    }

    Object.assign(product, data);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.featured = !product.featured;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleVisible = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.isVisible = !product.isVisible;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getProducts, 
  getAllProductsAdmin, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  toggleFeatured,
  toggleVisible
};
