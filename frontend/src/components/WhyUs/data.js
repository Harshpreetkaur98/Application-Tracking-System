import personalisedFeedback from "../../assets/images/personalised-feedback.jpeg";
import phraselyUpdates from "../../assets/images/phrasely-updates.jpeg";
import aiPoweredInsights from "../../assets/images/ai-powered-resume-insights.jpeg";
import transparentHiring from "../../assets/images/transparent-hiring.jpeg";

const data = [
  { 
    id: 1, 
    title: "Personalised Rejection Feedback",
    description: "Receive detailed, constructive feedback on why your application wasn't selected, helping you improve for future opportunities.",
    image: personalisedFeedback,
    features: [
      "Specific feedback on resume gaps",
      "Skill improvement suggestions",
      "Personalized recommendations based on job requirements",
      "Actionable insights from hiring managers"
    ]
  },
  { 
    id: 2, 
    title: "Phrase by Phrase Application Updates",
    description: "Stay informed throughout every stage of the application process with transparent, real-time updates on your application status.",
    image: phraselyUpdates,
    features: [
      "Real-time status tracking",
      "Detailed stage-by-stage updates",
      "Timeline estimates for each phase",
      "Notification preferences customization"
    ]
  },
  { 
    id: 3, 
    title: "AI Powered Resume Insights",
    description: "Our advanced AI analyzes your resume against job requirements, offering tailored suggestions to highlight your strengths and improve your chances.",
    image: aiPoweredInsights, 
    features: [
      "Keyword optimization for ATS systems",
      "Skills gap analysis for targeted positions",
      "Industry-specific formatting recommendations",
      "Comparative analysis with successful applicants"
    ]
  },
  { 
    id: 4, 
    title: "Transparent Hiring Process",
    description: "We bridge the gap between applicants and employers by providing full visibility into the hiring process, eliminating the typical black box experience.",
    image: transparentHiring,
    features: [
      "Clear hiring timeline visualization",
      "Defined evaluation criteria for each role",
      "Feedback loops throughout the process",
      "Direct communication channels with hiring teams"
    ]
  },
];

export default data;