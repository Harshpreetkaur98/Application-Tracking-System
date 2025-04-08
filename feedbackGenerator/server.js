require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const pdfParse = require('pdf-parse');

// Serve static images
const app = express();
const port = process.env.PORT || 3000;

// Serve static images (from the "images" folder)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Middleware to serve static files and handle JSON requests
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
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

// Generate thank you email
const generateThankYouEmail = async (jobTitle) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is missing');
    }

    const prompt = `Generate a professional thank you email for a candidate who has just applied for a position. Follow these guidelines:
    1. Format as a formal business email
    2. Start with "Dear candidate,"
    3. Thank them for applying to the position
    4. Mention we've received their application and will review it
    5. Let them know they'll hear back from us soon
    6. End with "Best regards, hAts Team"
    7. Keep it brief (100-150 words)
    8. Never use markdown or special formatting

    Job Title: ${jobTitle || 'the position'}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 200
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    let emailContent = response.data.candidates[0].content.parts[0].text;
    return emailContent.replace(/[*#_]/g, '')
                      .replace(/\n\s*\n/g, '\n\n')
                      .trim();
  } catch (error) {
    console.error('Error generating thank you email:', error.response?.data || error.message);
    throw new Error('Failed to generate thank you email');
  }
};

// Generate professional rejection email
const generateRejectionEmail = async (cvText, jobSpec) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is missing');
    }

    const jobTitle = jobSpec.split('\n')[0] || 'the position';
    
    const prompt = `Act as an HR specialist crafting constructive rejection feedback. Generate a polite but concise email with this structure:

    1. OPENING: "Dear [Candidate's Name],"
    2. APPRECIATION: 1 sentence thanking them for applying to ${jobTitle} at hAts
    3. DECISION: "After careful review, we've decided to move forward with other candidates."
    4. KEY FEEDBACK: Present 2-3 specific areas for improvement in bullet format:
       - Focus on skills mentioned in: ${jobSpec}
       - Compare with candidate's experience: ${cvText.substring(0, 1000)}
    5. ENCOURAGEMENT: 1 positive note about their application
    6. CLOSING: "We wish you success in your job search and hope you apply again!"
    
    Tone: Professional yet warm  
    Format: HTML  
    Word limit: 150 max  
    Do not include 'Best regards' in the main content.
    
    Append this HTML footer (with logo):
    
    <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6;">
      <p>Best regards,<br>The hAts Team</p>
      <img src="http://localhost:5000/images/logo.png" alt="hAts Logo" style="height:40px; margin-top: 20px;" />
    </div>
    `;

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
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    let emailContent = response.data.candidates[0].content.parts[0].text;
    return emailContent.replace(/[*#_]/g, '')
                      .replace(/\n\s*\n/g, '\n\n')
                      .trim();
  } catch (error) {
    console.error('Error generating rejection email:', error.response?.data || error.message);
    throw new Error('Failed to generate rejection email');
  }
};

// Email transporter (shared for both emails)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

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
    const jobTitle = req.body.jobSpec.split('\n')[0] || 'the position';

    // Send thank you email immediately
    const thankYouEmail = await generateThankYouEmail(jobTitle);
    await transporter.sendMail({
      from: `hAts Team <${process.env.EMAIL_USER}>`,
      to: req.body.email,
      subject: 'Thank you for your application to hAts',
      text: thankYouEmail,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6;">
              <p>${thankYouEmail.replace(/\n/g, '<br>')}</p>
            </div>`
    });

    // Send response to client
    res.json({ success: true, message: 'Thank you email sent. Feedback email will arrive shortly.' });

    // Schedule feedback email
    setTimeout(async () => {
      try {
        const rejectionEmail = await generateRejectionEmail(cvText, req.body.jobSpec);
        await transporter.sendMail({
          from: `hAts Team <${process.env.EMAIL_USER}>`,
          to: req.body.email,
          subject: 'Your Application Feedback from hAts',
          text: rejectionEmail,
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6;">
                  <p>${rejectionEmail.replace(/\n/g, '<br>')}</p>
                </div>`
        });
      } catch (error) {
        console.error('Error sending feedback email:', error);
      } finally {
        if (req.file?.path) fs.unlinkSync(req.file.path);
      }
    }, 60000);

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
