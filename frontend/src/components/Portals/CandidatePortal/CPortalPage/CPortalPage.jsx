import { useState } from 'react';
import './CPortalPage.css';

function CandidateLogin() {
  const [searchTerm, setSearchTerm] = useState('');

  const jobs = [
    {
      title: 'Software Engineer',
      company: 'TechCorp',
      rating: 4.2,
      location: 'London, UK',
      salary: '£50K - £60K (Glassdoor est.)',
      description: 'Join our growing engineering team building scalable platforms for millions of users...',
    },
    {
      title: 'Frontend Developer',
      company: 'Innovatech',
      rating: 4.5,
      location: 'Remote',
      salary: '£60K - £70K (Glassdoor est.)',
      description: 'Seeking a frontend developer experienced in React and TypeScript to join our agile team.',
    },
    // You can add more jobs here...
  ];

  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.company} ${job.description}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
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
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <div className="job-card" key={index}>
                <h3>{job.title}</h3>
                <p><strong>{job.company}</strong> <span className="rating">{job.rating} ★</span> – {job.location}</p>
                <p className="salary">{job.salary}</p>
                <p className="desc">{job.description}</p>
              </div>
            ))
          ) : (
            <p style={{ padding: '1rem' }}>No jobs match your search.</p>
          )}

          {filteredJobs.length > 0 && (
            <button className="load-more">Load More Jobs</button>
          )}
        </section>
      </main>
    </div>
  );
}

export default CandidateLogin;
