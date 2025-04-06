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

// Generate professional rejection email
const generateRejectionEmail = async (cvText, jobSpec) => {
  try {
    const prompt = `You are an HR representative at hAts. Generate a professional rejection email for a candidate based on their CV and our job requirements. Follow these guidelines strictly:

    1. Format as a formal business email
    2. Start with "Dear candidate,"
    3. First paragraph should thank them for applying
    4. Second paragraph should contain 4-5 specific reasons for rejection and each reason should be explained, have this paragraph in atleast 300 words but less than 350 words
    5. Keep it professional but polite
    6. End with "Best regards, hAts Team"
    7. Never use markdown or special formatting
    8. Keep it under 600 words

   
     Job Title: ${jobSpec.split('\n')[0] || 'AI Chatbot Coding Trainer'}

    Job Requirements:
    ${jobSpec}

    Candidate's CV Excerpt:
    ${cvText.slice(0, 2000)}
    Generate the rejection email:`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 500
        }
      }
    );

    let emailContent = response.data.candidates[0].content.parts[0].text;
    // Clean up any residual formatting
    emailContent = emailContent.replace(/[*#_]/g, '')
                              .replace(/\n\s*\n/g, '\n\n')
                              .trim();

    return emailContent;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate rejection email');
  }
};

// Send rejection email
const sendRejectionEmail = async (to, emailContent) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });

  const mailOptions = {
    from: `hAts Team <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Application to hAts',
    text: emailContent,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6;">
        <p>${emailContent.replace(/\n/g, '<br>')}</p>
        <br>
        <img src="https://example.com/hats-logo.png" alt="hAts Logo" width="120">
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Upload route
app.post('/upload', upload.single('cv'), async (req, res) => {
  try {
    // Validate inputs
    if (!req.file || !req.body.jobSpec?.trim() || !req.body.email?.trim()) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Process request
    const cvText = await extractTextFromPdf(req.file.path);
    const rejectionEmail = await generateRejectionEmail(cvText, req.body.jobSpec);
    await sendRejectionEmail(req.body.email, rejectionEmail);

    // Cleanup
    fs.unlinkSync(req.file.path);
    res.json({ success: true, message: 'Rejection email sent' });

  } catch (error) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});