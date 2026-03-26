require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    // Connect to database without starting server
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected for seeding...');
    
    // Check if an admin already exists
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (adminExists) {
      console.log('====================================');
      console.log('✅ Admin user already exists!');
      console.log('Email: admin@example.com');
      console.log('====================================');
      process.exit();
    }
    
    // Create new admin user (Password is automatically hashed by User model hook)
    const adminUser = new User({
      name: 'System Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'Admin'
    });
    
    await adminUser.save();
    console.log('====================================');
    console.log('🎉 Admin user seeded successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('====================================');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
