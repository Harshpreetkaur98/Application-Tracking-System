import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CvScanner.css";
import Navbar from "../Navbar/Navbar";


const CvScanner = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [jobSpec, setJobSpec] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please upload a PDF file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("drag-over");
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const droppedFile = files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError("");
      } else {
        setFile(null);
        setError("Please upload a PDF file");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please upload your CV");
      return;
    }
    
    if (!email) {
      setError("Please enter your email");
      return;
    }
    
    if (!jobSpec) {
      setError("Please enter the job specification");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("email", email);
    formData.append("jobSpec", jobSpec);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage(data.message);
        // Reset form
        setFile(null);
        setEmail("");
        setJobSpec("");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to submit. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="cv-scanner-container">
      <div className="cv-scanner-header">
        <h1>CV Feedback Generator</h1>
        <p>Get personalized feedback on your CV for specific job positions — available once for free. To access this service again, please register as a User.</p>
        </div>

      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="cv-scanner-form">
        <div className="form-columns">
          <div className="form-column">
            <h2>Your CV</h2>
            <div 
              className="cv-upload-area"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-icon">📄</div>
              <p className="upload-title">{file ? "File Selected" : "Upload your CV"}</p>
              <p className="upload-text">
                {file ? file.name : "Drag & drop your PDF here or click to browse"}
              </p>
              <input
                type="file"
                id="cv"
                accept=".pdf"
                onChange={handleFileChange}
                className="file-input"
              />
              {!file && (
                <button type="button" className="browse-button" onClick={() => document.getElementById('cv').click()}>
                  Browse Files
                </button>
              )}
              {file && (
                <button 
                  type="button" 
                  className="remove-file-button"
                  onClick={() => setFile(null)}
                >
                  Remove File
                </button>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Where should we send the feedback?"
                required
              />
            </div>
          </div>

          <div className="form-column">
            <h2>Job Specification</h2>
            <textarea
              id="jobSpec"
              value={jobSpec}
              onChange={(e) => setJobSpec(e.target.value)}
              placeholder="Paste the job description here..."
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="generate-feedback-button"
            disabled={isLoading}
          >
            {isLoading ? "Generating Feedback..." : "Generate Feedback"}
          </button>
          
          <button 
            type="button"
            className="back-button" 
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
        </div>
      </form>
      </div>
    </>
  );
};

export default CvScanner;