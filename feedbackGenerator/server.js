require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Set up multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (your HTML file)
app.use(express.static('public'));

// POST endpoint for handling the form submission
app.post('/upload', upload.single('cv'), async (req, res) => {
  console.log("📩 Received request at /upload");

  const { jobSpec, email, apiKey } = req.body;
  const senderEmail = process.env.SENDER_EMAIL; // From .env
  const senderPassword = process.env.SENDER_PASSWORD; // From .env
  const cvFile = req.file;

  console.log("📝 Form Data:", req.body);
  console.log("📂 Uploaded File:", cvFile);

  if (!cvFile) {
    return res.status(400).json({ success: false, message: "No file uploaded!" });
  }

  try {
    // Read the uploaded CV file
    const cvBuffer = fs.readFileSync(cvFile.path);
    const cvBase64 = cvBuffer.toString('base64'); // Convert file to Base64

    console.log("✅ File successfully read & converted.");

    // Prepare request to DeepSeek API
    const requestData = {
      model: 'deepseek-model', // Adjust based on your DeepSeek API
      input: {
        cv: cvBase64, // Send CV as Base64
        job_specifications: jobSpec,
      }
    };

    console.log("📡 Sending request to DeepSeek API...");
    const response = await axios.post('https://api.deepseek.com/analyze', requestData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const feedback = response.data.feedback;
    console.log("✅ Received response from DeepSeek:", feedback);

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: senderPassword, // Uses app password
      },
    });

    // Email options
    const mailOptions = {
      from: senderEmail,
      to: email,
      subject: 'CV Feedback',
      text: `Hello,

Here is the feedback on your CV based on the job specifications:

${feedback}

Best regards,
Your Feedback Generator`,
    };

    // Send email
    console.log("📧 Sending email to", email);
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");

    // Send success response
    res.json({ success: true, message: 'Feedback sent successfully!' });

    // Clean up uploaded file
    fs.unlinkSync(cvFile.path);

  } catch (error) {
    console.error("❌ Error processing request:", error);

    let errorMessage = "An error occurred.";
    if (error.response) {
      errorMessage = `DeepSeek API Error: ${error.response.data.error_msg || "Unknown error"}`;
    }

    res.status(500).json({ success: false, message: errorMessage });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
