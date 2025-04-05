const express = require('express');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const nodemailer = require('nodemailer');
const pdfParse = require('pdf-parse');
const fs = require('fs');

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

// Generate feedback using OpenAI API
const generateFeedback = async (cvText, jobSpec, apiKey) => {
  const prompt = `Compare the following CV with the job specifications and provide feedback:\nCV: ${cvText.slice(0, 2000)}\nJob Specifications: ${jobSpec}\nHighlight missing skills and why the candidate might be rejected.`;

  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful HR assistant.' },
      { role: 'user', content: prompt }
    ]
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data.choices[0].message.content.trim();
};

// Send email with feedback
const sendEmail = async (receiverEmail, feedback, senderEmail, senderPassword) => {
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
    const { jobSpec, email, apiKey, senderEmail, senderPassword } = req.body;

    // Extract text from the uploaded CV
    const cvText = await extractTextFromPdf(req.file.path);

    // Generate feedback from OpenAI
    const feedback = await generateFeedback(cvText, jobSpec, apiKey);

    // Send the feedback via email
    await sendEmail(email, feedback, senderEmail, senderPassword);

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
