import { useState } from "react";
import "./SignUp.css";
import Navbar from "../Navbar/Navbar";
import { registerEmployer, registerCandidate } from "../../api/api";
// import { register } from "../../../../backend/controllers/employerController";


const SignIn = () => {

  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePassword, setCandidatePassword] = useState("");
  const [companyEmail, setEmployerEmail] = useState("");
  const [employerPassword, setEmployerPassword] = useState("");

  const handleCandidateSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await registerCandidate(candidateEmail, candidatePassword);
      console.log("Candidate Registered:", res);
    } catch (err) {
      console.error("Error:", err);
    }
  };
  
  // ✅ Handle Employer Signup
  const handleEmployerSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await registerEmployer(companyEmail, employerPassword);
      console.log("Employer Registered:", res);
    } catch (err) {
      console.error("Error:", err);
    }
  };


  return (
    <div className="signin-container">
      <Navbar />
      <h1 className="signin-title">Sign Up</h1>
      <div className="signin-boxes">
        {/* Candidate Sign-In */}
        <div className="signin-box">
          <h2>Candidate Sign Up</h2>
          <form onSubmit={handleCandidateSignup}>
            <label>Email</label>
            <input type="email" placeholder="Enter your email" className="placeholder-signin"  required
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)} />

            <label>Password</label>
            <input type="password" placeholder="Enter your password" className="placeholder-signin" required 
              value={candidatePassword}
              onChange={(e) => setCandidatePassword(e.target.value)}/>

            <div className="signin-options">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" className="signin-button">Sign Up</button>
          </form>
          <p>Already have an account? <a href="/signup" className="Login-option">Login</a></p>
        </div>

        {/* Employer Sign-In */}
        <div className="signin-box">
          <h2>Employer Sign Up</h2>
          <form onSubmit={handleEmployerSignup}>
            <label>Company Email</label>
            <input type="email" className="placeholder-signin" placeholder="Enter company email" required value={companyEmail}
              onChange={(e) => setEmployerEmail(e.target.value)}/>

            <label>Password</label>
            <input type="password" placeholder="Enter password" className="placeholder-signin" required  value={employerPassword}
              onChange={(e) => setEmployerPassword(e.target.value)}/>

            <div className="signin-options">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" className="signin-button">Sign Up</button>
          </form>
          <p>Already have an account?  <a href="/signup-employer" className="Login-option">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
