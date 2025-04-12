import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Captcha.css";

const Captcha = ({ onVerify }) => {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  
  // Generate a random captcha text
  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput("");
    setIsVerified(false);
    setError("");
  };

  // Initialize captcha on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Handle verification
  const handleVerify = () => {
    if (userInput === captchaText) {
      setIsVerified(true);
      setError("");
      if (onVerify) onVerify(true);
    } else {
      setError("Incorrect CAPTCHA. Please try again.");
      generateCaptcha();
      if (onVerify) onVerify(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  return (
    <div className="captcha-container">
      <div className="captcha-label">Verify you are human</div>
      
      <div className="captcha-box">
        <div className="captcha-text">{captchaText}</div>
        <button 
          type="button" 
          className="refresh-button" 
          onClick={generateCaptcha}
          aria-label="Refresh CAPTCHA"
        >
          ↻
        </button>
      </div>
      
      <input
        type="text"
        className="captcha-input placeholder-login"
        placeholder="Enter the text above"
        value={userInput}
        onChange={handleInputChange}
        disabled={isVerified}
      />
      
      {error && <div className="captcha-error">{error}</div>}
      
      {!isVerified ? (
        <button 
          type="button" 
          className="verify-button" 
          onClick={handleVerify}
        >
          Verify
        </button>
      ) : (
        <div className="verified-message">✓ Verified</div>
      )}
    </div>
  );
};

Captcha.propTypes = {
  onVerify: PropTypes.func.isRequired,
};

export default Captcha;