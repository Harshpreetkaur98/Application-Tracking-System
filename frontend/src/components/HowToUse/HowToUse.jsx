import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import GuideSection from "./GuideSection";
import { guideData } from "./data";
import "./HowToUse.css";

const HowToUse = () => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="how-to-use-container">
      <Navbar />
      
      <div className="guide-hero">
        <div className="guide-hero-content">
          <h1>How to Use hAts</h1>
          <p>Your complete guide to maximizing your job search with our intelligent applicant tracking system</p>
        </div>
      </div>
      
      <div className="guide-intro">
        <div className="intro-card">
          <h2>Getting Started</h2>
          <p>
            Welcome to hAts - the smart applicant tracking system that bridges the gap between 
            candidates and employers. This guide will walk you through all the features of our 
            platform to help you make the most of your job search journey.
          </p>
          <div className="intro-buttons">
            <button className="intro-button primary" onClick={() => navigate("/SignUp")}>
              Create Account
            </button>
            <button className="intro-button secondary" onClick={() => navigate("/Login")}>
              Log In
            </button>
          </div>
        </div>
      </div>
      
      <div className="guide-content">
        {guideData.map((section, index) => (
          <GuideSection 
            key={index}
            title={section.title}
            description={section.description}
            imageUrl={section.imageUrl}
            steps={section.steps}
            tips={section.tips}
            isReversed={index % 2 !== 0}
          />
        ))}
      </div>
      
      <div className="guide-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>How is hAts different from other job platforms?</h3>
            <p>
              Unlike traditional platforms, hAts provides detailed feedback on rejected applications, 
              helping you understand what to improve for future opportunities.
            </p>
          </div>
          <div className="faq-item">
            <h3>How detailed is the application feedback?</h3>
            <p>
              Our feedback includes specific areas for improvement, actionable advice, and explanations 
              of why certain skills matter for particular roles.
            </p>
          </div>
          <div className="faq-item">
            <h3>Can I track my application status?</h3>
            <p>
              Yes! Our Your Activity section shows real-time updates on all your applications, 
              including if you are under consideration, rejected, selected, or called for an interview.
            </p>
          </div>
          <div className="faq-item">
            <h3>Who can see my profile information?</h3>
            <p>
              Only employers you have applied to can view your profile information. Your data is not 
              visible to other candidates or companies.
            </p>
          </div>
        </div>
      </div>
      
      <div className="guide-cta">
        <h2>Ready to transform your job search?</h2>
        <p>Start using hAts today and get the feedback you deserve.</p>
        <button className="cta-button" onClick={() => navigate("/SignUp")}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HowToUse;