import { useState, useEffect } from 'react';
import './EPortalPage.css';
import { CiCirclePlus } from "react-icons/ci";
import { FiUsers, FiBriefcase, FiClock } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployerPortal = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalApplicants, setTotalApplicants] = useState(0);
  
  useEffect(() => {
    // Function to fetch jobs from the database
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs');
        if (response.data && response.data.jobs) {
          setJobs(response.data.jobs);
        } else {
          setJobs([]);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
        setJobs([]);
      }
    };

    // Function to fetch candidates from the database
const fetchCandidates = async () => {
  try {
    console.log('Fetching candidates from: http://localhost:5000/api/candidates');
    const response = await axios.get('http://localhost:5000/api/candidates');
    console.log('Candidates response:', response.data);
    
    if (response.data && response.data.candidates) {
      console.log('Candidates found:', response.data.candidates.length);
      setCandidates(response.data.candidates);
      setTotalApplicants(response.data.candidates.length);
    } else {
      console.log('No candidates data found in response:', response.data);
      setCandidates([]);
      setTotalApplicants(0);
    }
  } catch (err) {
    console.error('Error fetching candidates:', err);
    console.error('Error details:', err.response ? err.response.data : 'No response data');
    setError('Failed to load applicants. Please try again later.');
    setCandidates([]);
    setTotalApplicants(0);
  }
};


    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchJobs(), fetchCandidates()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handlePostJob = () => {
    navigate('/Employer-Portal/settings');
  };

  const calculateAvgTimeToHire = () => {
    return '14 days'; 
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="employer-dashboard">
      <div className="dashboard-header">
        <h1>Employer Dashboard</h1>
        <p className="welcome-text">Welcome back, Employer!</p>
      </div>

      <div className="dashboard-grid">
        <div className="stats-card">
          <div className="stats-card-icon">
            <FiBriefcase />
          </div>
          <div className="stats-card-content">
            <h3>Total Jobs</h3>
            <p className="stats-card-value">{jobs.length}</p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-icon">
            <FiUsers />
          </div>
          <div className="stats-card-content">
            <h3>Total Applications</h3>
            <p className="stats-card-value">{totalApplicants}</p>
          </div>
        </div>

        <div className="stats-card action-card" onClick={handlePostJob}>
          <div className="stats-card-icon">
            <CiCirclePlus />
          </div>
          <div className="stats-card-content">
            <h3>Post a Job</h3>
            <p className="stats-card-action">Create new listing</p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card-icon">
            <FiClock />
          </div>
          <div className="stats-card-content">
            <h3>Average Time to Hire</h3>
            <p className="stats-card-value">{calculateAvgTimeToHire()}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-card job-posts-card">
          <div className="card-header">
            <h2>Recent Job Posts</h2>
          </div>
          <div className="job-posts-list">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job._id} className="job-post-item">
                  <div className="job-post-header">
                    <h3>{job.title}</h3>
                    <span className="job-post-location">{job.location || 'Remote'}</span>
                  </div>
                  <p className="job-post-description">{job.description}</p>
                  {job.skillsRequired && job.skillsRequired.length > 0 && (
                    <div className="job-skills">
                      {job.skillsRequired.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  )}
                  <div className="job-post-footer">
                    <span className="job-date">Posted on: {formatDate(job.createdAt)}</span>
                    {job.salaryRange && <span className="job-salary">{job.salaryRange}</span>}
                  </div>
                  <div className="job-post-actions">
                    <button className="btn-outline" onClick={() => navigate('/Employer-Portal/settings', { state: { job } })}>Edit</button>
                    <button className="btn-outline" onClick={() => navigate('/Employer-Portal/settings', { state: { job } })}>View Applications</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No job postings found. Click Post a Job to create your first job listing.</p>
              </div>
            )}
          </div>
        </div>

{/* Recent Applicants */}
          <div className="content-card applicants-card">
            <div className="card-header">
              <h2>Recent Applicants</h2>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="applicants-list">
              {loading ? (
                <p>Loading applicants...</p>
              ) : candidates.length > 0 ? (
                candidates.slice(0, 5).map((candidate) => (
                  <div key={candidate._id} className="applicant-item">
                    <div className="applicant-avatar document-icon" 
                        onClick={() => candidate.resume && window.open(`http://localhost:5000/${candidate.resume}`, '_blank')}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div className="applicant-info">
                      <h3>{candidate.name || 'Candidate'}</h3>
                      <p>{candidate.email}</p>
                      <span className="applicant-date">Joined: {formatDate(candidate.createdAt)}</span>
                    </div>
                    <div className="applicant-actions">
                      {candidate.resume && (
                        <a 
                          href={`http://localhost:5000/${candidate.resume}`} 
                          download
                          className="btn-outline resume-btn"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download CV
                        </a>
                      )}
                      <button className="btn-outline">View</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No applicants found yet.</p>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default EmployerPortal;