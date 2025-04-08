const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  candidateName: { 
    type: String, 
    required: true 
  },
  candidateEmail: { 
    type: String, 
    required: true 
  },
  candidatePhone: { 
    type: String, 
    required: true 
  },
  resumePath: { 
    type: String, 
    required: true 
  },
  coverLetter: { 
    type: String 
  },
  status: { 
    type: String, 
    default: 'Applied', 
    enum: ['Applied', 'Reviewed', 'Interview', 'Rejected', 'Hired'] 
  },
  appliedAt: { 
    type: Date, 
    default: Date.now 
  },
  feedback: {
    type: String,
    default: ''
  }
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;