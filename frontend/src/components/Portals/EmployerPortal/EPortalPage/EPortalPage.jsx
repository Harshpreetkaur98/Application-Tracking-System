import 'react';
import './EPortalPage.css';
import { CiCirclePlus } from "react-icons/ci";

const EmployerPortal = () => {
  return (
    <div className="admin-portal">

      {/* === TOP GRID === */}
      <div className="dashboard-grid">

        {/* === Profile Box === */}
        <div className="dashboard-box profile-box">
          <div className="admin-icon" />
          <h3 className="profile-name">Welcome, Employer!</h3>
          <p className="profile-role">Admin Panel</p>
        </div>

        {/* === Job Stats Box === */}
        <div className="dashboard-box stat-box">
          <div className="stat-row">
            <div className="stat-group">
              <p className="stat-label">Total Jobs</p>
              <h2 className="stat-value">24</h2>
            </div>
            <div className="stat-group clickable">
              <p className="stat-label">Post a Job</p>
              <CiCirclePlus size={28} />
            </div>
            <div className="stat-group">
              <p className="stat-label">Total Applications</p>
              <h2 className="stat-value">29</h2>
            </div>
          </div>
        </div>


        {/* === Applicants List Box === */}
        <div className="dashboard-box applicant-box">
          <h3>Recent Applicants</h3>
          <div className="applicant-list">
            {['John Doe', 'Jane Smith', 'Aarav Patel', 'Sarah Lee', 'Michael Tan'].map((name, index) => (
              <div className="applicant-item" key={index}>
                <p className="applicant-name">{name}</p>
                <p className="applicant-position">Applied for: UI/UX Designer</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* === RECENT JOB POSTS SECTION === */}
      <div className="recent-jobs-section">
        <h2 className="section-title">Recent Job Posts</h2>
        <div className="job-posts-container">
          {[...Array(10)].map((_, index) => (
            <div className="job-post" key={index}>
              <div className="job-post-header">
                <h3>Software Engineer Intern</h3>
                <span>California, USA</span>
              </div>
              <p>
                Join a fast-growing tech company as an intern. Help build scalable systems and grow your career!
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployerPortal;
