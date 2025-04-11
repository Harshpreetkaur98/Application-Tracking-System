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
    5. Let them know they'll hear back from within 5 working days
    6. End with "Best regards, hAts Team"
    7. Keep it brief (under 100 words)
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
    const prompt = `Compose a professional rejection email for a job applicant with this exact structure:

1. FORMAT: Formal business email
2. OPENING: "Dear Candidate,"
3. FIRST PARAGRAPH (30-50 words):
   - Thank them for applying to [Job Title]
   - Acknowledge their time and effort
   - Clearly state they weren't selected

4. SECOND PARAGRAPH (300-350 words):
   "After careful review, we identified these specific areas for improvement:"
   
   Present 4-5 rejection reasons as BULLET POINTS with this structure for each:
   - [Skill/Area Missing]: [Specific evidence from their application]
     • "How to improve:" [Actionable advice with 2-3 concrete suggestions]
     • "Why this matters:" [Brief explanation of importance to the role]

   Example Format:
   - Technical Writing: Your application didn't demonstrate experience creating technical documentation.
     • How to improve: Take a technical writing course (like Google's on Coursera) and contribute to open-source documentation.
     • Why this matters: This role requires weekly client reports and system documentation.

5. CLOSING PARAGRAPH (50-80 words):
   - Encourage future applications
   - Wish them success
   - "Best regards, hAts Team"

TONE REQUIREMENTS:
• Professional but warm (like a mentor)
• Constructive criticism only
• Never condescending
• Avoid corporate jargon

SPECIFIC INSTRUCTIONS:
1. For "Communication Skills" feedback, include suggestions like:
   - "Join Toastmasters or practice presentations"
   - "Highlight team collaborations in your resume"
   - "Ask colleagues for feedback on your clarity"

2. For technical skills, suggest:
   - Relevant online courses
   - Certification programs
   - Practical projects to demonstrate skills

3. Use the candidate's actual CV gaps and the job's real requirements from:
   Job Title: ${jobSpec.split('\n')[0]}
   Requirements: ${jobSpec}
   CV Excerpt: ${cvText.substring(0, 2000)}

4. STRICTLY follow these formatting rules:
   - Plain text only (NO markdown, NO bold/italics)
   - Max 600 words total
   - Bullet points must use "-" and "•" exactly as shown
   - Never use phrases like "we regret to inform you"`;

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

// ... (previous imports remain the same)
const { calculateATSScore } = require('./atsScoringService');

// Add this new function
const generateAcceptanceEmail = async (jobTitle) => {
      try {
        const prompt = `Generate a professional job offer acceptance email with these exact specifications:
    
    1. OPENING: 
       - Start with "Dear Candidate,"
       - Begin with a congratulatory statement
       - Mention the specific job title: ${jobTitle}
    
    2. BODY (40-60 words):
       - State they've been selected
       - Specify they'll receive onboarding details within 5 working days
       - Include one positive comment about their application
       - Express enthusiasm about their joining
    
    3. CLOSING:
       - "Best regards, hAts Team"
       
    FORMAT REQUIREMENTS:
    • Plain text only (no markdown)
    • Exactly 80-100 words total
    • Professional but warm tone
    • Must include "5 working days" timeframe
    • No placeholders like [Number]
    
    EXAMPLE OUTPUT:
    Dear Alex,
    
    Congratulations! We're pleased to offer you the ${jobTitle} position at hAts. Your technical skills and project experience stood out during our review.
    
    You'll receive detailed onboarding instructions and contract documents within 5 working days. We're excited to have you join our engineering team and contribute to our upcoming projects.
    
    Best regards,
    hAts Team`;

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

    return response.data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('Error generating acceptance email:', error);
    throw new Error('Failed to generate acceptance email');
  }
};

// Modify processApplicationFeedback
// Modify processApplicationFeedback
const processApplicationFeedback = async (applicationId) => {
  try {
    const application = await Application.findById(applicationId).populate('jobId');
    if (!application) throw new Error('Application not found');

    const cvText = await extractTextFromPdf(application.resumePath);
    const jobSpec = `${application.jobId.title}\n${application.jobId.description}\nRequired Skills: ${application.jobId.skillsRequired.join(', ')}`;

    // Calculate ATS score with error handling
    let atsResult;
    try {
      atsResult = await calculateATSScore(cvText, jobSpec);
    } catch (error) {
      console.error('ATS scoring failed, using fallback evaluation:', error);
      atsResult = {
        score: 30, // Default to rejection score if calculation fails
        missingSkills: ['System could not evaluate your application properly'],
        skillsMatch: []
      };
    }

    // Update application with score
    await Application.findByIdAndUpdate(applicationId, {
      atsScore: atsResult.score,
      status: 'Reviewed'
    });

    // Send thank you email
    await sendEmail(application.candidateEmail, await generateThankYouEmail(application.jobId.title));

    // Process selection after 1 minute
    setTimeout(async () => {
      try {
        // Get all applications for this job
        const allApplications = await Application.find({ jobId: application.jobId._id })
          .sort({ atsScore: -1 });

        // Determine selection based on both ranking AND minimum score
        const MIN_ACCEPTANCE_SCORE = 70; // Set your threshold here
        const isSelected = allApplications.findIndex(app => app._id.equals(applicationId)) < 5 
                          && atsResult.score >= MIN_ACCEPTANCE_SCORE;

        if (isSelected) {
          const acceptanceEmail = await generateAcceptanceEmail(application.jobId.title);
          await sendEmail(application.candidateEmail, acceptanceEmail, true);
          await Application.findByIdAndUpdate(applicationId, {
            status: 'Selected',
            feedback: 'Congratulations! You have been selected for the next round.'
          });
        } else {
          // Enhanced rejection feedback
          let feedback;
          if (atsResult.score < MIN_ACCEPTANCE_SCORE) {
            feedback = `Your application scored ${atsResult.score}/100 (minimum required: ${MIN_ACCEPTANCE_SCORE}).\n`;
            feedback += 'Key areas for improvement:\n';
            feedback += atsResult.missingSkills?.length > 0 
              ? atsResult.missingSkills.map(skill => `- ${skill}`).join('\n')
              : '- General qualifications need strengthening';
          } else {
            feedback = 'While your application was strong, we had limited positions available.\n';
            feedback += 'We encourage you to apply for future openings.';
          }

          const rejectionEmail = await generateRejectionEmail(feedback, jobSpec);
          await sendEmail(application.candidateEmail, rejectionEmail, true);
          await Application.findByIdAndUpdate(applicationId, {
            status: 'Rejected',
            feedback
          });
        }
      } catch (error) {
        console.error('Error in selection process:', error);
      } finally {
        if (application.resumePath) fs.unlinkSync(application.resumePath);
      }
    }, 60000);

  } catch (error) {
    console.error('Error processing application:', error);
    throw error;
  }
};

// ... (rest of the file remains the same)

module.exports = {
  processApplicationFeedback
};