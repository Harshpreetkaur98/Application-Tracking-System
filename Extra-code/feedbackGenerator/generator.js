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

// Generate thank you email
const generateThankYouEmail = async (jobTitle, apiKey) => {
  const prompt = `Generate a brief thank you email (100-150 words) for a candidate who has applied for ${jobTitle}. Just say we've received their application and will review it. Format as a plain text business email.`;

  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an HR assistant.' },
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

// Route to handle CV upload and feedback generation
app.post('/upload', upload.single('cv'), async (req, res) => {
  try {
    const { jobSpec, email, apiKey, senderEmail, senderPassword } = req.body;

    // Extract text from the uploaded CV
    const cvText = await extractTextFromPdf(req.file.path);
    const jobTitle = jobSpec.split('\n')[0] || 'the position';

    // Send thank you email immediately
    const thankYouEmail = await generateThankYouEmail(jobTitle, apiKey);
    await sendEmail(email, thankYouEmail, senderEmail, senderPassword);

    // Send response to client immediately
    res.send({ success: true, message: 'Thank you email sent. Feedback email will arrive shortly.' });

    // Schedule the feedback email to be sent after 1 minute
    setTimeout(async () => {
      try {
        const feedback = await generateFeedback(cvText, jobSpec, apiKey);
        await sendEmail(email, feedback, senderEmail, senderPassword);
        console.log('Feedback email sent successfully after delay');
      } catch (error) {
        console.error('Error sending feedback email:', error);
      } finally {
        // Cleanup
        if (req.file?.path) fs.unlinkSync(req.file.path);
      }
    }, 60000); // 60,000 ms = 1 minute

  } catch (error) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    console.error(error);
    res.status(500).send({ success: false, message: 'Error generating emails' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
