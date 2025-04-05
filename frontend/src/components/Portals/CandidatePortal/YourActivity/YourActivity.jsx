
import './YourActivity.css';

function YourActivity() {
  return (
    <div className="activity-page">
      <h1>Your Activity</h1>
      <section className="activity-section">
        <h2>Applied jobs</h2>
        <div className="activity-card">
          <p><strong>Software Developer</strong> at TechCorp</p>
          <p>Applied on April 3, 2025</p>
        </div>
        <div className="activity-card">
          <p><strong>Frontend Engineer</strong> at Innovate Ltd</p>
          <p>Applied on April 2, 2025</p>
        </div>
      </section>
      <section className="activity-section">
        <h2>Saved Jobs</h2>
        <div className="activity-card saved">
          <p><strong>UX Designer</strong> at Creatives Co.</p>
          <button>Apply</button>
        </div>
      </section>
    </div>
  );
}

export default YourActivity;
