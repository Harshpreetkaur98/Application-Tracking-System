import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/api";  // Import the loginUser function
import "./Login.css";
import Navbar from "../Navbar/Navbar";
import Captcha from "../Captcha/Captcha";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const handleCaptchaVerify = (status) => {
    setIsCaptchaVerified(status);
  };

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!isCaptchaVerified) {
      setError("Please complete the CAPTCHA verification");
      return;
    }


    try {
      const data = await loginUser(email, password); // Call API
  
      console.log("Login Response:", data); // Debugging log
  
      if (data.message === "ADMIN login successfull") {
        console.log("ADMIN logged into the system.");
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/Employer-Portal");  // ✅ Navigate to Employer Portal for Admin
      } else if (data.message === "Login successful") {
        const user = data.user;
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/Candidate-Portal"); // ✅ Navigate for Candidate role
  
        if (user.role === "admin") {
          navigate("/Employer-Portal");  // ✅ Navigate for Admin role (if role exists)
        } else if (user.role === "candidate") {
          navigate("/Candidate-Portal"); // ✅ Navigate for Candidate role
        }
      }
    } catch (error) {
      console.log("Login Error:", error);
      setError(error || "Invalid email or password");
    }
  };
  

  return (
    <div className="login-container">
      <Navbar />
      <h1 className="login-title">Welcome Back!</h1>
      <div className="login-boxes">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="placeholder-login"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="placeholder-login"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
             <Captcha onVerify={handleCaptchaVerify} />

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="login-options">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <a href="/forgot-password" className="forgot-password">
                Forgot Password?
              </a>
            </div>

            <button 
              type="submit" 
              className="login-button-icon" 
              disabled={!isCaptchaVerified}
            >Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
