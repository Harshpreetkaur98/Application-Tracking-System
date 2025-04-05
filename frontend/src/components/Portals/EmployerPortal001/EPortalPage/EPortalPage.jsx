
import "./EPortalPage.css";

const EPortalPage = () => {
  return (
    <div className="portal-container">
      <h2 className="portal-heading">
        Manage your job listings, view applications, and access the ATS.
      </h2>
      <div className="content-section">
        <div className="job-posts-container">
          <h3>Recent Job Posts</h3>
          <div className="job-card">SWE Graduate 2025<br />San Diego<br />Status - Active</div>
          <div className="job-card">SWE Graduate 2025<br />San Diego<br />Status - Active</div>
          <div className="job-card">SWE Graduate 2025<br />San Diego<br />Status - Active</div>
        </div>
        <div className="placeholder-box">
          {/* Placeholder for additional ATS functionality */}
        </div>
      </div>
    </div>
  );
};

export default EPortalPage;
