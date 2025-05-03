require('dotenv').config();
const axios = require('axios');

const calculateATSScore = async (cvText, jobSpec) => {
  try {
    const prompt = `Analyze this CV against the job requirements and calculate an ATS score (0-100). 
    Consider skills match (50%), experience relevance (30%), and qualifications (20%).
    Return ONLY a JSON object with this structure: 
    { "score": number, "skillsMatch": [string], "missingSkills": [string], "experienceGap": string }
    
    Important: Return ONLY the JSON object, no markdown formatting or additional text.
    
    Job Requirements: ${jobSpec}
    CV Content: ${cvText.substring(0, 3000)}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 500,
          response_mime_type: "application/json"
        }
      }
    );

    let resultText = response.data.candidates[0].content.parts[0].text;
    
    resultText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(resultText);
  } catch (error) {
    console.error('Error calculating ATS score:', error.response?.data || error.message);
    throw new Error('Failed to calculate ATS score');
  }
};

module.exports = { calculateATSScore };