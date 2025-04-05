const mongoose = require('mongoose');

// MongoDB URI (replace with your actual URI or use MongoDB Atlas URL)
const dbURI = 'mongodb://localhost:27017/ats_system'; // Local MongoDB instance

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
