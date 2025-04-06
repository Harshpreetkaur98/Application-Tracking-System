require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const pdfParse = require('pdf-parse');

// Initialize Express
const app = express();
const port = 3000;

// Set up static folder for serving HTML
app.use(express.static('public'));

// Set up middleware for URL-encoded data and JSON data (built-in Express)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Extract text from the PDF
const extractTextFromPdf = async (pdfPath) => {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

// Generate feedback using Gemini API
const generateFeedback = async (cvText, jobSpec) => {
  const prompt = `Compare the following CV with the job specifications and provide feedback:\nCV: ${cvText.slice(0, 2000)}\nJob Specifications: ${jobSpec}\nHighlight missing skills and why the candidate might be rejected.`;

  const response = await axios.post('https://api.gemini.com/v1/generate-feedback', {
    model: 'gemini-model', // Adjust based on your Gemini API model name
    input: {
      cv: cvText,
      job_specifications: jobSpec,
    }
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`, // Using API key from .env
      'Content-Type': 'application/json'
    }
  });

  return response.data.feedback; // Assuming feedback is inside the 'feedback' field
};

// Send email with feedback
const sendEmail = async (receiverEmail, feedback) => {
  const senderEmail = process.env.SENDER_EMAIL; // Sender email from .env
  const senderPassword = process.env.SENDER_PASSWORD; // Sender email password from .env

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: senderEmail, pass: senderPassword }
  });

  let mailOptions = {
    from: senderEmail,
    to: receiverEmail,
    subject: 'Job Application Feedback',
    text: feedback
  };

  await transporter.sendMail(mailOptions);
};

// Route to handle CV upload and feedback generation
app.post('/upload', upload.single('cv'), async (req, res) => {
  try {
    const { jobSpec, email } = req.body; // Get recipient email from form

    // Extract text from the uploaded CV
    const cvText = await extractTextFromPdf(req.file.path);

    // Generate feedback from Gemini API
    const feedback = await generateFeedback(cvText, jobSpec);

    // Send the feedback via email
    await sendEmail(email, feedback);

    res.send({ success: true, message: 'Feedback sent to your email!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Error generating feedback' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
