import { useState, useEffect } from 'react';
import axios from 'axios';
import './CPortalPage.css';

function CandidatePortal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: ''
  });

  // Fetch jobs from the backend when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs/jobs');
        setJobs(response.data.jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Check application status when job or email changes
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (selectedJob && applicationForm.email) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/applications/status`, 
            {
              params: {
                jobId: selectedJob._id,
                email: applicationForm.email
              }
            }
          );
          setApplicationStatus(response.data);
        } catch (error) {
          console.error('Error checking application status:', error);
        }
      }
    };
    checkApplicationStatus();
  }, [selectedJob, applicationForm.email]);

  // Filter jobs based on the search term
  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.description} ${job.location}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
    setApplicationStatus(null); // Reset status when applying to new job
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm({
      ...applicationForm,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setApplicationForm({
      ...applicationForm,
      resume: e.target.files[0]
    });
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', applicationForm.name);
      formData.append('email', applicationForm.email);
      formData.append('phone', applicationForm.phone);
      formData.append('resume', applicationForm.resume);
      formData.append('coverLetter', applicationForm.coverLetter);
      formData.append('jobId', selectedJob._id);

      const response = await axios.post(
        'http://localhost:5000/api/applications/apply', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert(response.data.message || 'Application submitted successfully!');
      setShowApplyModal(false);
      
      // Reset form
      setApplicationForm({
        name: '',
        email: '',
        phone: '',
        resume: null,
        coverLetter: ''
      });

      // Set temporary status
      setApplicationStatus({
        status: 'Under Review',
        message: 'Your application is being processed. You will receive an update soon.'
      });

    } catch (error) {
      console.error('Error submitting application:', error);
      alert(error.response?.data?.message || 'Failed to submit application. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Selected':
        return <span className="status-badge success">Selected ✓</span>;
      case 'Rejected':
        return <span className="status-badge error">Rejected ✗</span>;
      case 'Under Review':
        return <span className="status-badge warning">Under Review</span>;
      default:
        return null;
    }
  };

  return (
    <div className="candidate-portal">
      <div className="search-header">
        <input
          type="text"
          placeholder="Search jobs..."
          className="job-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <main className="container">
        <aside className="filters">
          <h3>Job Type</h3>
          <label><input type="checkbox" /> Full-time</label>
          <label><input type="checkbox" /> Part-time</label>
          <h3>Company Rating</h3>
          <label><input type="checkbox" /> 4.0 & up</label>
          <label><input type="checkbox" /> 3.0 & up</label>
          <h3>Salary Estimate</h3>
          <label><input type="checkbox" /> £50k+</label>
          <label><input type="checkbox" /> £70k+</label>
          <h3>Location</h3>
          <label><input type="checkbox" /> Remote</label>
          <label><input type="checkbox" /> London</label>
        </aside>

        <section className="jobs">
          {loading ? (
            <p>Loading jobs...</p>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <div className="job-card" key={index}>
                <h3>{job.title}</h3>
                <p><strong>Company: hAts</strong> – {job.location}</p>
                <p className="salary">Salary: {job.salaryRange || 'competitive'}</p>
                <div className="desc">
                  <h4>Description:</h4>
                  <p>{job.description || 'No description provided'}</p>
                </div>
                <button 
                  className="apply-button"
                  onClick={() => handleApplyClick(job)}
                >
                  Apply Now
                </button>
              </div>
            ))
          ) : (
            <p style={{ padding: '1rem' }}>No jobs match your search.</p>
          )}
        </section>
      </main>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-button"
              onClick={() => setShowApplyModal(false)}
            >
              &times;
            </button>
            <h2>Apply for {selectedJob?.title}</h2>
            
            {applicationStatus && (
              <div className={`application-status ${applicationStatus.status.toLowerCase().replace(' ', '-')}`}>
                {getStatusBadge(applicationStatus.status)}
                <p>{applicationStatus.message}</p>
                {applicationStatus.feedback && (
                  <div className="feedback-details">
                    <h4>Feedback:</h4>
                    <p>{applicationStatus.feedback}</p>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmitApplication}>
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  name="name"
                  value={applicationForm.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={applicationForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number:</label>
                <input
                  type="tel"
                  name="phone"
                  value={applicationForm.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Resume (PDF):</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Cover Letter:</label>
                <textarea
                  name="coverLetter"
                  value={applicationForm.coverLetter}
                  onChange={handleInputChange}
                  rows="5"
                />
              </div>
              <button type="submit" className="submit-application">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CandidatePortal;