const mongoose = require('mongoose');

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  feedbackText: { type: String, required: true },
  sentAt: { type: Date, default: Date.now }
});

// Create Feedback model
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
