const mongoose = require('mongoose');

// Employer Schema
const employerSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create Employer model
const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;
