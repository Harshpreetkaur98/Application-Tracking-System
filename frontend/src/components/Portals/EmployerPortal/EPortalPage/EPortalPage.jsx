// EmployerPortal.jsx
import { useState, useEffect } from 'react';
import './EPortalPage.css';
import { CiCirclePlus } from "react-icons/ci";
import { FiUsers, FiBriefcase, FiClock } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to install axios: npm install axios

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
        const response = await axios.get('/api/jobs');
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
        const response = await axios.get('/api/candidates');
        if (response.data && response.data.candidates) {
          setCandidates(response.data.candidates);
          setTotalApplicants(response.data.candidates.length);
        } else {
          setCandidates([]);
          setTotalApplicants(0);
        }
      } catch (err) {
        console.error('Error fetching candidates:', err);
        setError('Failed to load applicants. Please try again later.');
        setCandidates([]);
        setTotalApplicants(0);
      }
    };

    // Call both fetch functions
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

  // Calculate the average time to hire (example calculation - update with your logic)
  const calculateAvgTimeToHire = () => {
    return '14 days'; // Replace with your actual calculation based on your data
  };

  // Format date to display in a readable format
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
        {/* Stats Cards */}
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
        {/* Recent Job Posts */}
        <div className="content-card job-posts-card">
          <div className="card-header">
            <h2>Recent Job Posts</h2>
            <button className="view-all-btn">View All</button>
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
                    <button className="btn-outline">Edit</button>
                    <button className="btn-outline">View Applications</button>
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
            {candidates.length > 0 ? (
              candidates.slice(0, 5).map((candidate) => (
                <div key={candidate._id} className="applicant-item">
                  <div className="applicant-avatar">
                    <img src="/api/placeholder/36/36" alt={candidate.name || 'Candidate'} />
                  </div>
                  <div className="applicant-info">
                    <h3>{candidate.name || 'Candidate'}</h3>
                    <p>{candidate.email}</p>
                    <span className="applicant-date">Joined: {formatDate(candidate.createdAt)}</span>
                  </div>
                  <button className="btn-outline">View</button>
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