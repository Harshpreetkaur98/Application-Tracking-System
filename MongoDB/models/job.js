const mongoose = require('mongoose');

// Job Schema
const jobSchema = new mongoose.Schema({
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  skillsRequired: { type: [String] }, // Store skills as an array of strings
  location: { type: String },
  salaryRange: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create Job model
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
