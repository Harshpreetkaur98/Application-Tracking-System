require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const pdfParse = require('pdf-parse');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// PDF text extraction
const extractTextFromPdf = async (pdfPath) => {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
};

// Generate feedback using Gemini API (Updated model)
const generateFeedback = async (cvText, jobSpec) => {
  try {
    const prompt = `Analyze this CV against the job specifications and provide detailed feedback:
    
    CV (First 2000 chars):
    ${cvText.slice(0, 2000)}
    
    Job Description:
    ${jobSpec}
    
    Provide:
    1. Key strengths matching the job
    2. Missing skills/qualifications
    3. Potential reasons for rejection
    4. Suggested improvements`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.5,  // Controls creativity (0-1)
          maxOutputTokens: 2000
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Unexpected API response structure');
    }

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate feedback. Please try again.');
  }
};

// Send email with improved error handling
const sendEmail = async (to, feedback) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD  // Use app password, not regular password
      },
      tls: {
        rejectUnauthorized: false  // For local testing only
      }
    });

    const mailOptions = {
      from: `CV Feedback Service <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your Personalized CV Feedback',
      text: feedback,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #2563eb;">CV Feedback Report</h2>
          <div style="white-space: pre-wrap; background: #f3f4f6; padding: 1rem; border-radius: 0.5rem;">
            ${feedback.replace(/\n/g, '<br>')}
          </div>
          <p style="margin-top: 1rem; color: #6b7280;">
            This feedback was generated automatically. For questions, reply to this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email Error:', error);
    throw new Error('Failed to send email. Please check your email address.');
  }
};

// Upload route with enhanced validation
app.post('/upload', upload.single('cv'), async (req, res) => {
  try {
    // Validate file
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No CV file uploaded' 
      });
    }

    // Validate other inputs
    const { jobSpec, email } = req.body;
    if (!jobSpec?.trim() || !email?.trim()) {
      fs.unlinkSync(req.file.path);  // Clean up file
      return res.status(400).json({ 
        success: false, 
        message: 'Job description and email are required' 
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email address' 
      });
    }

    // Process request
    const cvText = await extractTextFromPdf(req.file.path);
    const feedback = await generateFeedback(cvText, jobSpec);
    await sendEmail(email, feedback);

    // Clean up
    fs.unlinkSync(req.file.path);

    res.json({ 
      success: true, 
      message: 'Feedback sent successfully! Check your email.' 
    });

  } catch (error) {
    // Clean up file if exists
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Server Error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'An unexpected error occurred' 
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Gemini Model: gemini-1.5-pro-latest`);
});