const express = require('express');
const multer = require('multer');
const path = require('path');
const Application = require('../models/application');
const Job = require('../models/job');
const mongoose = require('mongoose');

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

// Get all applications for a job (for employers)
router.get('/job/:jobId', async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('jobId', 'title');
    
    res.status(200).json({ applications });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching applications', error: err.message });
  }
});

// Update application status (for employers)
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

// Add feedback to application (for employers)
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