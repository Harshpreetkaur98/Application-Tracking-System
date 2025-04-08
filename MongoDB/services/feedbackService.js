require('dotenv').config();
console.log('Gemini API Key:', process.env.GEMINI_API_KEY ? '***loaded***' : 'MISSING!');

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const pdfParse = require('pdf-parse');
const Application = require('../models/application');
const Job = require('../models/job');

// Extract text from the PDF
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
      throw new Error('Gemini API key is missing from environment variables');
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
      }
    );

    let emailContent = response.data.candidates[0].content.parts[0].text;
    emailContent = emailContent.replace(/[*#_]/g, '')
                              .replace(/\n\s*\n/g, '\n\n')
                              .trim();

    return emailContent;
  } catch (error) {
    console.error('Error generating thank you email:', error);
    throw new Error('Failed to generate thank you email');
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
    emailContent = emailContent.replace(/[*#_]/g, '')
                              .replace(/\n\s*\n/g, '\n\n')
                              .trim();

    return emailContent;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error('Failed to generate rejection email');
  }
};

// Send email
const sendEmail = async (to, emailContent, isFeedback = false) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });

  const subject = isFeedback 
    ? 'Your Application to hAts - Feedback' 
    : 'Thank you for your application to hAts';

  const mailOptions = {
    from: `hAts Team <${process.env.EMAIL_USER}>`,
    to,
    subject,
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

// Process application and generate feedback
const processApplicationFeedback = async (applicationId) => {
  try {
    // Find the application and populate job details
    const application = await Application.findById(applicationId).populate('jobId');
    if (!application) {
      throw new Error('Application not found');
    }

    // Extract text from CV
    const cvText = await extractTextFromPdf(application.resumePath);
    
    // Get job specifications (combine title, description, and skills)
    const jobSpec = `
      ${application.jobId.title}
      ${application.jobId.description}
      Required Skills: ${application.jobId.skillsRequired.join(', ')}
    `;

    // Send thank you email immediately
    const thankYouEmail = await generateThankYouEmail(application.jobId.title);
    await sendEmail(application.candidateEmail, thankYouEmail);

    // Schedule feedback email after delay
    setTimeout(async () => {
      try {
        const feedbackEmail = await generateRejectionEmail(cvText, jobSpec);
        await sendEmail(application.candidateEmail, feedbackEmail, true);
        
        // Update application with feedback in database
        await Application.findByIdAndUpdate(applicationId, {
          feedback: feedbackEmail
        });

        console.log(`Feedback sent for application ${applicationId}`);
      } catch (error) {
        console.error('Error sending feedback email:', error);
      }
    }, 60000); // 1 minute delay

  } catch (error) {
    console.error('Error processing application feedback:', error);
    throw error;
  }
};

module.exports = {
  processApplicationFeedback
};