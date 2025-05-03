const express = require('express');
const multer = require('multer');
const path = require('path');
const Application = require('../models/application');
const Job = require('../models/job');
const mongoose = require('mongoose');
const { processApplicationFeedback } = require('../services/feedbackService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Submit application route
router.post('/apply', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, coverLetter, jobId } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !req.file || !jobId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Create new application
    const newApplication = new Application({
      jobId,
      candidateName: name,
      candidateEmail: email,
      candidatePhone: phone,
      resumePath: req.file.path,
      coverLetter: coverLetter || ''
    });

    await newApplication.save();

    processApplicationFeedback(newApplication._id)
      .catch(err => console.error('Error in feedback process:', err));

    res.status(201).json({
      message: 'Application submitted successfully',
      application: {
        id: newApplication._id,
        jobTitle: job.title,
        candidateName: newApplication.candidateName,
        status: newApplication.status
      }
    });
  } catch (err) {
    console.error('Error submitting application:', err);
    res.status(500).json({ message: 'Error submitting application', error: err.message });
  }
});

router.get('/job/:jobId/top', async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .sort({ atsScore: -1 })
      .limit(5)
      .populate('jobId', 'title');
    
    res.status(200).json({ applications });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching top applications', error: err.message });
  }
});

router.get('/status', async (req, res) => {
  try {
    const { jobId, email } = req.query;
    
    if (!jobId || !email) {
      return res.status(400).json({ message: 'jobId and email are required' });
    }

    const application = await Application.findOne({ 
      jobId, 
      candidateEmail: email 
    }).select('status feedback atsScore');

    if (!application) {
      return res.status(404).json({ 
        status: 'Not Applied',
        message: 'No application found for this job and email'
      });
    }

    res.status(200).json({
      status: application.status,
      message: `Your application is currently ${application.status}`,
      feedback: application.feedback,
      score: application.atsScore
    });
  } catch (err) {
    res.status(500).json({ message: 'Error checking application status', error: err.message });
  }
});

router.get('/resume/:filename', (req, res) => {
  const file = path.join(__dirname, '../../uploads/resumes', req.params.filename);
  res.download(file);
});

router.get('/job/:jobId', async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('jobId', 'title');
    
    res.status(200).json({ applications });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching applications', error: err.message });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!updatedApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.status(200).json({
      message: 'Application status updated',
      application: updatedApplication
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating application status', error: err.message });
  }
});

router.put('/:id/feedback', async (req, res) => {
  try {
    const { feedback } = req.body;
    
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { feedback },
      { new: true }
    );
    
    if (!updatedApplication) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.status(200).json({
      message: 'Feedback added to application',
      application: updatedApplication
    });
  } catch (err) {
    res.status(500).json({ message: 'Error adding feedback', error: err.message });
  }
});

module.exports = router;