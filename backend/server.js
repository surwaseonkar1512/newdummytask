require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/stories', require('./routes/storyRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/about', require('./routes/aboutRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
