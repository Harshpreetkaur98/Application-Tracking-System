import 'react';
import './EPortalPage.css';
import { CiCirclePlus } from "react-icons/ci";

const EmployerPortal = () => {
  return (
    <div className="admin-portal">
      {/* <section className="welcome-banner">
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
      </section> */}

      <div className='admin-info-box'>
        <div className='admin-icon'>
        </div>
        <div className='admin-options'>
          <div className='admin-option-div'>
            <p className='post-job'>Total</p>
              <p style={{fontSize:'20px'}}>24</p>
            <p className='post-job'>Job</p>
          </div>
          <div className='admin-option-div'>
            <p className='post-job'>Post a</p>
              <CiCirclePlus/>
            <p className='post-job'>Job</p>
          </div>
          <div className='admin-option-div'>
            <p className='post-job'>Total</p>
              <p style={{fontSize:'20px'}}>29</p>
            <p className='post-job'>Applicants</p>
          </div>
        </div>
      </div>
      <div className='admin-info-box-2'>
        
      </div>
      <div className='admin-info-box-2'>
        
      </div>
      <div className='admin-info-box-3'>
        <p style={{color:'black', paddingTop:'10px', fontSize:'20px', marginBottom:'5px'}}>
          Recent Job Post
        </p>
        <div className='job-post'>
          <div style={{
            display:'flex',
            width:'100%',
            justifyContent:'space-between'
          }}>
            <h2>
              Software Research Intern
            </h2>
            <h2>
              Califonia, USA
            </h2>
          </div>
          <p style={{width:'80%'}}>
            Fantastic opportunity for Developers! The oppurtunity Hub UK id delighted to announce that we are actively seeking
            motivated individuals to join the dynamic team of a growing retail investment tech
            company as a Web Developer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployerPortal;
