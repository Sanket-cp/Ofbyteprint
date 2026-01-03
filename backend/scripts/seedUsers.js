const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/printhub';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing users (optional)
    // await User.deleteMany({});
    // console.log('Cleared existing users');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@printhub.com' });
    if (existingUser) {
      console.log('Demo user already exists');
      return;
    }

    // Create demo users
    const demoUsers = [
      {
        name: 'Demo User',
        email: 'demo@printhub.com',
        password: await bcrypt.hash('demo123', 12),
        role: 'user',
        isEmailVerified: true,
        phone: '+919876543210',
        address: {
          street: '123 Demo Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        },
        preferences: {
          notifications: {
            email: true,
            sms: false
          },
          currency: 'INR',
          language: 'en'
        },
        isActive: true
      },
      {
        name: 'Admin User',
        email: 'admin@printhub.com',
        password: await bcrypt.hash('admin123', 12),
        role: 'admin',
        isEmailVerified: true,
        phone: '+919876543211',
        address: {
          street: '456 Admin Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400002',
          country: 'India'
        },
        preferences: {
          notifications: {
            email: true,
            sms: true
          },
          currency: 'INR',
          language: 'en'
        },
        isActive: true
      }
    ];

    // Insert users
    const createdUsers = await User.insertMany(demoUsers);
    console.log(`Created ${createdUsers.length} demo users:`);
    createdUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    console.log('\nDemo credentials:');
    console.log('User: demo@printhub.com / demo123');
    console.log('Admin: admin@printhub.com / admin123');

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function
seedUsers();