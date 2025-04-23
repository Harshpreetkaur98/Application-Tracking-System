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
  console.log(`[PDF Extraction] Starting to process PDF at path: ${pdfPath}`);
  try {
    console.log(`[PDF Extraction] Reading file from disk...`);
    const dataBuffer = fs.readFileSync(pdfPath);
    console.log(`[PDF Extraction] File read successfully, file size: ${dataBuffer.length} bytes`);
    
    console.log(`[PDF Extraction] Beginning PDF parsing...`);
    const data = await pdfParse(dataBuffer);
    console.log(`[PDF Extraction] PDF parsing successful, extracted ${data.text.length} characters`);
    
    return data.text;
  } catch (error) {
    console.error(`[PDF Extraction ERROR] Failed to process PDF file: ${pdfPath}`);
    console.error(`[PDF Extraction ERROR] Error type: ${error.name}, Message: ${error.message}`);
    // console.error(`[PDF Extraction ERROR] Full error details:`, error);
    
    // Check if error is related to PDF structure
    if (error.message && error.message.includes('Invalid PDF structure')) {
      console.error(`[PDF Extraction ERROR] The file appears to be in an invalid PDF format`);
    } else if (error.code === 'ENOENT') {
      console.error(`[PDF Extraction ERROR] File not found at the specified path`);
    }
    
    throw new Error('Could not access the file, wrong CV format submitted so candidate is not considered');
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
    9. Do not add the Subject within the email body
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

    // Add proper error handling and logging for debugging
    if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
      console.error('Unexpected API response structure:', JSON.stringify(response.data));
      throw new Error('Invalid response from Gemini API');
    }

    // Check for the correct path to text content
    if (!response.data.candidates[0].content || 
        !response.data.candidates[0].content.parts || 
        !response.data.candidates[0].content.parts[0] ||
        !response.data.candidates[0].content.parts[0].text) {
      console.error('Text content not found in API response:', JSON.stringify(response.data.candidates[0]));
      throw new Error('Text content not found in API response');
    }

    let emailContent = response.data.candidates[0].content.parts[0].text;
    emailContent = emailContent.replace(/[*#_]/g, '')
                              .replace(/\n\s*\n/g, '\n\n')
                              .trim();

    return emailContent;
  } catch (error) {
    console.error('Error generating thank you email:', error.response?.data || error.message);
    // Provide a fallback email if API fails
    return `Dear candidate,

Thank you for applying for ${jobTitle || 'the position'} at hAts. We have received your application and will review it carefully.

You can expect to hear back from us within 5 working days regarding the next steps in the selection process.

Best regards,
hAts Team`;
  }
};

// Generate professional rejection email
const generateRejectionEmail = async (cvText, jobSpec) => {
  try {
    const prompt = `Compose a concise, professional rejection email that respectfully guides the candidate on their development path:

1. FORMAT: Clear, modern business email
2. OPENING: Brief, professional greeting and clear but kind rejection
3. MAIN SECTION:
   Use this exact structure:   
   "We've identified several **key skills** where strengthening your expertise would better align with our requirements:"
   
   For each skill gap (choose 3-4 most relevant):
   
   **[SKILL NAME IN BOLD]**
   Brief explanation of the gap (1 sentence)
   Quick, actionable improvement suggestion (1-2 sentences)
   
4. CLOSING: Brief encouragement for future growth and applications (2-3 sentences)
   "Best regards, hAts Team"

TONE REQUIREMENTS:
- Direct but supportive
- Mentoring rather than criticizing
- Focusing on growth opportunity
- Professional but human

SPECIFIC INSTRUCTIONS:
1. Total length: 250 words maximum
2. Make skills visually stand out for quick scanning
3. Prioritize actionable advice over explanations
4. Use the candidate's actual CV gaps against the job requirements:
   Job Title: ${jobSpec.split('\n')[0]}
   Requirements: ${jobSpec}
   CV Excerpt: ${cvText.substring(0, 2000)}
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
  try {
    // Read the logo file and convert to base64
    const logoPath = path.join(__dirname, '../uploads/logo/logo.png');
    
    // Check if logo file exists before trying to read it
    if (!fs.existsSync(logoPath)) {
      console.error('Logo file not found at path:', logoPath);
      throw new Error('Logo file not found');
    }
    
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');
    
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

    // Improve HTML formatting for better email client compatibility
    const mailOptions = {
      from: `hAts Team <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: emailContent, // Plain text version for clients that don't support HTML
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
          <div style="margin-bottom: 20px;">
            ${emailContent.replace(/\n/g, '<br>')}
          </div>
          <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
            <img src="cid:companyLogo" alt="hAts Logo" style="width: 120px; height: auto;" />
          </div>
        </div>
      `,
      attachments: [{
        filename: 'logo.png',
        content: Buffer.from(logoBase64, 'base64'),
        cid: 'companyLogo' // Content ID referenced in the HTML
      }]
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};


const generateApplicationViewedEmail = (jobTitle) => {
  return `Dear Candidate,

Thank you for your recent application for the ${jobTitle} position at hAts. We wanted to let you know that your application has been viewed by our hiring team and is currently under review.

We're carefully evaluating all candidates, and you'll receive detailed feedback on your application shortly.

Best regards,
hAts Team`;
};


const generateSkillsHighlightEmail = async (jobTitle, skills, cvText) => {
  // Check if CV meets minimum length requirement
  // A typical CV should be at least 1500 characters (roughly 300 words)
  const MIN_CV_LENGTH = 1500;
  
  if (!cvText || cvText.length < MIN_CV_LENGTH) {
    console.log('CV length insufficient for skills highlight email. Length:', cvText ? cvText.length : 0);
    return false; // Return false to indicate email should not be sent
  }
  
  try {
    // Ensure we have at least one skill to highlight
    const skillsToHighlight = Array.isArray(skills) && skills.length > 0 
      ? skills.slice(0, 2) // Take up to 2 skills
      : ["professional background", "qualifications"];
    
    // Build the API prompt
    const prompt = `Generate a professional email highlighting specific skills of a job candidate. Follow these guidelines:
    
    1. FORMAT: Begin with "Dear Candidate," and end with "Best regards, hAts Team"
    2. OPENING: Brief statement that we're reviewing applications for the ${jobTitle} position
    3. MAIN SECTION:
       - Tell the candidate we're impressed with their skills
       - For each skill, provide a brief explanation of how we recognize their expertise in this area
       - Include at least one specific observation about each skill
       
    4. CLOSING: Mention that we've completed initial assessment and will be in touch soon
    
    SPECIFIC INSTRUCTIONS:
    - Highlight these specific skills: ${skillsToHighlight.join(', ')}
    - For each skill, include 1-2 sentences describing our understanding of their expertise
    - Keep the email professional but warm
    - Total length: 150-200 words maximum
    - Do not use markdown formatting
    `;
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 300
        }
      }
    );
    // Add proper error handling
    if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
      console.error('Unexpected API response structure:', JSON.stringify(response.data));
      throw new Error('Invalid response from Gemini API');
    }
    // Check for the correct path to text content
    if (!response.data.candidates[0].content || 
        !response.data.candidates[0].content.parts || 
        !response.data.candidates[0].content.parts[0] ||
        !response.data.candidates[0].content.parts[0].text) {
      console.error('Text content not found in API response:', JSON.stringify(response.data.candidates[0]));
      throw new Error('Text content not found in API response');
    }
    
    let emailContent = response.data.candidates[0].content.parts[0].text;
    emailContent = emailContent.replace(/[*#_]/g, '')
                              .replace(/\n\s*\n/g, '\n\n')
                              .trim();
    return emailContent;
    
  } catch (error) {
    console.error('Error generating skills highlight email:', error.response?.data || error.message);
    
    // Only return fallback email if CV meets length requirements
    const skillsToHighlight = Array.isArray(skills) && skills.length > 0 
      ? skills.slice(0, 2) 
      : ["your professional background", "your qualifications"];
    
    let skillsText = "";
    
    if (skillsToHighlight.length === 2) {
      skillsText = `${skillsToHighlight[0]} (your demonstrated expertise in this area shows strong practical application) and ${skillsToHighlight[1]} (where your capabilities align perfectly with our team needs)`;
    } else {
      skillsText = `${skillsToHighlight[0]} (where your demonstrated expertise shows strong practical application)`;
    }
    
    return `Dear Candidate,

We've been reviewing applications for the ${jobTitle} position at hAts, and we wanted to let you know that we're particularly impressed with ${skillsText} on your CV.

Our team has completed the initial assessment of your application, and we will be in touch with you very soon regarding the next steps.

Thank you for your patience throughout this process.

Best regards,
hAts Team`;
  }
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
      console.log("ATS Result:", atsResult); // Add this for debugging
    } catch (error) {
      console.error('ATS scoring failed, using fallback evaluation:', error);
      atsResult = {
        score: 30, // Default to rejection score if calculation fails
        missingSkills: ['System could not evaluate your application properly'],
        skillsMatch: []
      };
    }

    // Ensure skills data is properly formatted as arrays
    const skillsMatch = Array.isArray(atsResult.skillsMatch) ? atsResult.skillsMatch : [];
    const missingSkills = Array.isArray(atsResult.missingSkills) ? atsResult.missingSkills : [];

    // Update application with score and skills data
    await Application.findByIdAndUpdate(applicationId, {
      atsScore: atsResult.score,
      status: 'Reviewed',
      skillsMatch: skillsMatch,
      missingSkills: missingSkills
    });

    // Send thank you email
    await sendEmail(application.candidateEmail, await generateThankYouEmail(application.jobId.title));


    setTimeout(async () => {
      try {
        // Send application viewed email
        const viewedEmailContent = generateApplicationViewedEmail(application.jobId.title);
        await sendEmail(application.candidateEmail, viewedEmailContent);
        console.log(`Application viewed email sent to ${application.candidateEmail}`);
      } catch (error) {
        console.error('Error sending application viewed email:', error);
      }
    }, 30000); // 30 seconds


    setTimeout(async () => {
      try {
        
        // Send skills highlight email only if CV has sufficient content
        const skillsHighlightEmailContent = await generateSkillsHighlightEmail(
          application.jobId.title, 
          skillsMatch, // Use the skills that matched from ATS analysis
          cvText // Pass the CV text for length checking
        );
        
        // Only proceed with sending email if we have valid content
        if (skillsHighlightEmailContent) {
          await sendEmail(application.candidateEmail, skillsHighlightEmailContent);
          console.log(`Skills highlight email sent to ${application.candidateEmail}`);
        } else {
          console.log(`Skills highlight email skipped for ${application.candidateEmail} due to insufficient CV length`);
        }
      } catch (error) {
        console.error('Error sending skills highlight email:', error);
      }
    }, 40000);

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
          // Create detailed feedback for selected candidates
          let feedback = 'Congratulations! You have been selected for the next round.';
          
          // Add skills match information to feedback
          if (skillsMatch.length > 0) {
            feedback += '\n\nStrengths that matched our requirements:';
            skillsMatch.forEach(skill => {
              feedback += `\n- ${skill}`;
            });
          }
          
          const acceptanceEmail = await generateAcceptanceEmail(application.jobId.title);
          await sendEmail(application.candidateEmail, acceptanceEmail, true);
          await Application.findByIdAndUpdate(applicationId, {
            status: 'Selected',
            feedback: feedback
          });
        } else {
          // Enhanced rejection feedback
          let feedback;
          if (atsResult.score < MIN_ACCEPTANCE_SCORE) {
            feedback = `Your application scored ${atsResult.score}/100 (minimum required: ${MIN_ACCEPTANCE_SCORE}).\n\n`;
            
            // Add skills match information if any
            if (skillsMatch.length > 0) {
              feedback += 'Your strengths:\n';
              skillsMatch.forEach(skill => {
                feedback += `- ${skill}\n`;
              });
              feedback += '\n';
            }
            
            // Add missing skills information
            feedback += 'Areas for improvement:\n';
            if (missingSkills.length > 0) {
              missingSkills.forEach(skill => {
                feedback += `- ${skill}\n`;
              });
            } else {
              feedback += '- General qualifications need strengthening\n';
            }
          } else {
            feedback = 'While your application was strong, we had limited positions available.\n';
            feedback += 'We encourage you to apply for future openings.';
            
            // Still include skills information
            if (skillsMatch.length > 0) {
              feedback += '\n\nYour strengths that matched our requirements:';
              skillsMatch.forEach(skill => {
                feedback += `\n- ${skill}`;
              });
            }
            
            if (missingSkills.length > 0) {
              feedback += '\n\nAreas that could be strengthened:';
              missingSkills.forEach(skill => {
                feedback += `\n- ${skill}`;
              });
            }
          }

          const rejectionEmail = await generateRejectionEmail(cvText, jobSpec);
          await sendEmail(application.candidateEmail, rejectionEmail, true);
          await Application.findByIdAndUpdate(applicationId, {
            status: 'Rejected',
            feedback
          });
        }
      } catch (error) {
        console.error('Error in selection process:', error);
      } finally {
        if (application.resumePath && fs.existsSync(application.resumePath)) {
          fs.unlinkSync(application.resumePath);
        }
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