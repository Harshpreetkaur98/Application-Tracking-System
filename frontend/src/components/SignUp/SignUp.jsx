import { useState } from "react";
import "./SignUp.css";
import Navbar from "../Navbar/Navbar";
import { registerCandidate } from "../../api/api";
import Captcha from "../Captcha/Captcha";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePassword, setCandidatePassword] = useState("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  
  const handleCaptchaVerify = (verified) => {
    setIsCaptchaVerified(verified);
  };

  const calculatePasswordStrength = (password) => {
    // Initialize score
    let score = 0;
    
    // Empty password
    if (password.length === 0) return 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[a-z]/.test(password)) score += 1; // Has lowercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
    
    return Math.min(score, 5); // Max score is 5
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setCandidatePassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0: return "No Password";
      case 1: return "Very Weak";
      case 2: return "Weak";
      case 3: return "Medium";
      case 4: return "Strong";
      case 5: return "Very Strong";
      default: return "";
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 1: return "#ff4d4d"; // Red
      case 2: return "#ffaa00"; // Orange
      case 3: return "#ffdd00"; // Yellow
      case 4: return "#73e600"; // Light green
      case 5: return "#00b300"; // Dark green
      default: return "#e0e0e0"; // Gray
    }
  };
  
  const handleCandidateSignup = async (e) => {
    e.preventDefault();
    
    // Clear previous error messages
    setError("");
    
    if (!isCaptchaVerified) {
      alert("Please verify you are human first");
      return;
    }

    // Optional: Add password strength requirement
    if (passwordStrength < 3) {
      setError("Please choose a stronger password (at least medium strength)");
      return;
    }
    
    try {
      const res = await registerCandidate(candidateEmail, candidatePassword);
      console.log("Candidate Registered:", res);
      
      // After successful registration, navigate to candidate portal
      navigate("/candidate-portal");
    } catch (err) {
      console.error("Error:", err);
      
      // More robust error handling
      if (err.response) {
        // Server responded with an error status code
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 400) {
          // Handle 400 Bad Request - likely a duplicate email
          setError("This email is already registered. Please use a different email or login.");
        } else if (data && data.message) {
          // Use server error message if available
          setError(data.message);
        } else {
          // Generic error message
          setError("Registration failed. Please try again.");
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError("Server not responding. Please try again later.");
      } else {
        // Something happened in setting up the request
        setError("Email already in use. Please try Logging in.");
      }
    }
  };

  return (
    <div className="signin-page">
      <Navbar />
      <div className="signin-container">
        <h1 className="signin-title">Sign Up</h1>
        <div className="signin-box">
          
          {/* Display error message if exists */}
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleCandidateSignup}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                id="email"
                type="email" 
                placeholder="Enter your email" 
                className={`placeholder-signin ${error ? "input-error" : ""}`}
                required
                value={candidateEmail}
                onChange={(e) => {
                  setCandidateEmail(e.target.value);
                  if (error) setError(""); // Clear error when typing
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                id="password"
                type="password" 
                placeholder="Enter your password" 
                className="placeholder-signin" 
                required 
                value={candidatePassword}
                onChange={handlePasswordChange}
              />
              {/* Password Strength Meter */}
              <div className="password-strength-meter">
                <div className="strength-bar">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div 
                      key={level}
                      className="strength-segment"
                      style={{
                        backgroundColor: level <= passwordStrength ? getPasswordStrengthColor() : "#e0e0e0",
                      }}
                    ></div>
                  ))}
                </div>
                <div className="strength-label">
                  {passwordStrength > 0 && `Password Strength: ${getPasswordStrengthLabel()}`}
                </div>
              </div>
            </div>
            <div className="signin-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember Me</label>
              </div>
            </div>
            <div className="captcha-wrapper">
              <Captcha onVerify={handleCaptchaVerify} />
            </div>
            <button 
              type="submit" 
              className="signin-button"
              disabled={!isCaptchaVerified}
            >
              Sign Up
            </button>
          </form>
          <p className="login-redirect">
            Already have an account? <Link to="/login" className="login-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;