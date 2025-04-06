import { useState, useEffect } from 'react';
import axios from 'axios';
import './CPortalPage.css';

function CandidateLogin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs from the backend when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs/jobs');
        setJobs(response.data.jobs); // Assuming the response contains a 'jobs' array
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on the search term
  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.description} ${job.location}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
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
                </div>
              ))
            ) : (
              <p style={{ padding: '1rem' }}>No jobs match your search.</p>
            )}
          </section>
      </main>
    </div>
  );
}

export default CandidateLogin;