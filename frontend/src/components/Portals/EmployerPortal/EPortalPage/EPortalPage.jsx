import 'react';
import './EPortalPage.css';

const EmployerPortal = () => {
  return (
    <div className="admin-portal">
      <section className="welcome-banner">
        <h1>Welcome, [Company Name]!</h1>
        <p>Welcome to your employer portal where you can manage your job listings, view applications, and access ATS insights.</p>
      </section>

      <section className="quick-stats">
        <div className="stat-card">
          <h3>Total Jobs Posted</h3>
          <p>25</p>
        </div>
        <div className="stat-card">
          <h3>Active Job Listings</h3>
          <p>10</p>
        </div>
        <div className="stat-card">
          <h3>Total Applicants</h3>
          <p>150</p>
        </div>
        <div className="stat-card">
          <h3>Shortlisted vs Rejected</h3>
          <p>10 Shortlisted | 5 Rejected</p>
        </div>
      </section>

      <section className="recent-job-postings">
        <h2>Recent Job Postings</h2>
        <div className="job-list">
          <div className="job-item">
            <h4>Software Engineer</h4>
            <p>Applications: 35</p>
            <p>Status: Active</p>
            <div className="actions">
              <button>View</button>
              <button>Edit</button>
              <button>Delete</button>
            </div>
          </div>
          <div className="job-item">
            <h4>UI/UX Designer</h4>
            <p>Applications: 20</p>
            <p>Status: Closed</p>
            <div className="actions">
              <button>View</button>
              <button>Edit</button>
              <button>Delete</button>
            </div>
          </div>
        </div>
      </section>

      <section className="recent-applications">
        <h2>Recent Applications</h2>
        <div className="application-list">
          <div className="application-item">
            <h4>John Doe</h4>
            <p>Applied for: Software Engineer</p>
            <p>Status: Under Review</p>
          </div>
          <div className="application-item">
            <h4>Jane Smith</h4>
            <p>Applied for: UI/UX Designer</p>
            <p>Status: Shortlisted</p>
          </div>
        </div>
      </section>

      <section className="feedback-ats-insights">
        <h2>Feedback & ATS Insights</h2>
        <div className="insights-card">
          <p>Candidates Shortlisted: 8</p>
          <p>Top-Ranked Candidate: John Doe</p>
          <button>Access ATS Reports</button>
        </div>
      </section>

      <section className="action-buttons">
        <button className="action-btn">Post a New Job</button>
        <button className="action-btn">View All Applications</button>
        <button className="action-btn">Manage Jobs</button>
      </section>
    </div>
  );
};

export default EmployerPortal;
