const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCategory = async (req, res) => {
  const { name, slug, image, heading, paragraph } = req.body;
  try {
    let finalSlug = slug;
    if (!finalSlug) {
      finalSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    
    // Ensure uniqueness
    const existing = await Category.findOne({ slug: finalSlug });
    if (existing) {
      finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 8)}`;
    }

    const category = new Category({ 
      name, 
      slug: finalSlug, 
      image,
      heading,
      paragraph 
    });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  const { name, slug, image, heading, paragraph } = req.body;
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      let finalSlug = slug || category.slug;
      if (finalSlug !== category.slug) {
        const existing = await Category.findOne({ slug: finalSlug });
        if (existing && existing._id.toString() !== category._id.toString()) {
          finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 8)}`;
        }
      }

      category.name = name || category.name;
      category.slug = finalSlug;
      category.image = image || category.image;
      category.heading = heading !== undefined ? heading : category.heading;
      category.paragraph = paragraph !== undefined ? paragraph : category.paragraph;
      
      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.deleteOne();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
