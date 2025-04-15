import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2 } from "lucide-react";
import "./JobListings.css";
import PropTypes from "prop-types";

const JobListings = ({ onEditJob }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/jobs");
        setJobs(response.data.jobs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to load jobs. Please try again later.");
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        await axios.delete(`http://localhost:5000/api/jobs/${jobId}`);
        // Remove the deleted job from the state
        setJobs(jobs.filter(job => job._id !== jobId));
        alert("Job deleted successfully");
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete the job. Please try again.");
      }
    }
  };

  if (loading) return <div className="loading">Loading jobs...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="jobs-container">
      <h2 className="text-2xl font-semibold mb-6">Your Job Listings</h2>
      
      {jobs.length === 0 ? (
        <div className="no-jobs">
          <p>You have not posted any jobs yet.</p>
        </div>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <h3 className="job-title">{job.title}</h3>
                <div className="job-actions">
                  <button 
                    className="edit-btn" 
                    onClick={() => onEditJob(job)}
                    title="Edit job"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDeleteJob(job._id)}
                    title="Delete job"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="job-details">
                <p className="job-location">{job.location}</p>
                {job.salaryRange && <p className="job-salary">{job.salaryRange}</p>}
              </div>
              
              <p className="job-description">{job.description.substring(0, 150)}...</p>
              
              <div className="job-skills">
                {job.skillsRequired && job.skillsRequired.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
              
              <div className="job-date">
                Posted on: {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
JobListings.propTypes = {
  onEditJob: PropTypes.func.isRequired,
};

export default JobListings;