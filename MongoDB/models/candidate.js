const mongoose = require('mongoose');

// Candidate Schema
const candidateSchema = new mongoose.Schema({
  name: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cvFilePath: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create Candidate model
const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
