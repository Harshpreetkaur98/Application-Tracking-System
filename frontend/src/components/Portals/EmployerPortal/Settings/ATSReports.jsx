import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Download, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronRight, 
  User, 
  Users, 
  Clock, 
  PieChart, 
  FileText,
  ThumbsUp,
  ThumbsDown,
  AlertCircle
} from 'lucide-react';
import './ATSReports.css'; // We'll create this CSS file

const ATSReports = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'selected', 'rejected'
  const [jobStats, setJobStats] = useState(null);

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

  const fetchCandidates = async (jobId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/applications/job/${jobId}`);
      setCandidates(response.data.applications);
      setSelectedJob(jobId);
      
      // Calculate job statistics
      const allCandidates = response.data.applications;
      const selected = allCandidates.filter(c => c.status === 'Selected');
      const rejected = allCandidates.filter(c => c.status === 'Rejected');
      const pending = allCandidates.filter(c => c.status === 'Pending' || c.status === 'Reviewed');
      
      setJobStats({
        total: allCandidates.length,
        selected: selected.length,
        rejected: rejected.length,
        pending: pending.length,
        averageScore: allCandidates.reduce((sum, c) => sum + (c.atsScore || 0), 0) / allCandidates.length || 0
      });
      
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = (resumePath) => {
    window.open(`http://localhost:5000/${resumePath}`, '_blank');
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (activeTab === 'all') return true;
    if (activeTab === 'selected') return candidate.status === 'Selected';
    if (activeTab === 'rejected') return candidate.status === 'Rejected';
    return true;
  });

  return (
    <div className="ats-reports-container">
      <h2 className="section-title">ATS Reports</h2>
      
      <div className="reports-layout">
        {/* Jobs List */}
        <div className="jobs-sidebar">
          <h3 className="sidebar-title">Posted Jobs</h3>
          {loading && !selectedJob ? (
            <div className="loader">Loading jobs...</div>
          ) : (
            <ul className="jobs-list">
              {jobs.map(job => (
                <li 
                  key={job._id}
                  className={`job-item ${selectedJob === job._id ? 'active' : ''}`}
                  onClick={() => fetchCandidates(job._id)}
                >
                  <div className="job-title">{job.title}</div>
                  <div className="job-location">{job.location || 'Remote'}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Main Content */}
        <div className="reports-content">
          {selectedJob ? (
            <>
              {/* Job Statistics */}
              {jobStats && (
                <div className="job-statistics">
                  <div className="stat-card">
                    <Users className="stat-icon" />
                    <div className="stat-content">
                      <div className="stat-value">{jobStats.total}</div>
                      <div className="stat-label">Total Applicants</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <ThumbsUp className="stat-icon success" />
                    <div className="stat-content">
                      <div className="stat-value">{jobStats.selected}</div>
                      <div className="stat-label">Selected</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <ThumbsDown className="stat-icon danger" />
                    <div className="stat-content">
                      <div className="stat-value">{jobStats.rejected}</div>
                      <div className="stat-label">Rejected</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <Clock className="stat-icon warning" />
                    <div className="stat-content">
                      <div className="stat-value">{jobStats.pending}</div>
                      <div className="stat-label">Pending Review</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <PieChart className="stat-icon info" />
                    <div className="stat-content">
                      <div className="stat-value">{jobStats.averageScore.toFixed(1)}</div>
                      <div className="stat-label">Avg. ATS Score</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="candidate-tabs">
                <button 
                  className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All Candidates ({candidates.length})
                </button>
                <button 
                  className={`tab-button ${activeTab === 'selected' ? 'active' : ''}`}
                  onClick={() => setActiveTab('selected')}
                >
                  Selected ({candidates.filter(c => c.status === 'Selected').length})
                </button>
                <button 
                  className={`tab-button ${activeTab === 'rejected' ? 'active' : ''}`}
                  onClick={() => setActiveTab('rejected')}
                >
                  Rejected ({candidates.filter(c => c.status === 'Rejected').length})
                </button>
              </div>

              {/* Candidates List */}
              <div className="candidates-list">
                <h3 className="content-title">
                  {activeTab === 'all' ? 'All Candidates' : 
                   activeTab === 'selected' ? 'Selected Candidates' : 'Rejected Candidates'} for: {jobs.find(j => j._id === selectedJob)?.title}
                </h3>
                
                {loading ? (
                  <div className="loader">Loading candidates...</div>
                ) : filteredCandidates.length === 0 ? (
                  <div className="empty-state">
                    <AlertCircle size={48} />
                    <p>No {activeTab === 'all' ? '' : activeTab} candidates found</p>
                  </div>
                ) : (
                  <div className="candidates-grid">
                    {filteredCandidates.map(candidate => (
                      <div key={candidate._id} className="candidate-card">
                        <div 
                          className="candidate-header"
                          onClick={() => setExpandedCandidate(expandedCandidate === candidate._id ? null : candidate._id)}
                        >
                          <div className="candidate-header-left">
                            {candidate.status === 'Selected' ? (
                              <CheckCircle2 className="status-icon success" />
                            ) : candidate.status === 'Rejected' ? (
                              <XCircle className="status-icon danger" />
                            ) : (
                              <Clock className="status-icon warning" />
                            )}
                            <div className="candidate-info">
                              <h4 className="candidate-name">{candidate.candidateName}</h4>
                              <span className="candidate-email">{candidate.candidateEmail}</span>
                            </div>
                          </div>
                          <div className="candidate-score">
                            <span className={`score-badge ${candidate.atsScore >= 70 ? 'high' : candidate.atsScore >= 50 ? 'medium' : 'low'}`}>
                              {candidate.atsScore || 0}/100
                            </span>
                            {expandedCandidate === candidate._id ? <ChevronDown /> : <ChevronRight />}
                          </div>
                        </div>
                        
                        {expandedCandidate === candidate._id && (
                          <div className="candidate-details">
                            <div className="detail-row">
                              <div className="detail-label">Application Date:</div>
                              <div className="detail-value">
                                {new Date(candidate.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric', month: 'short', day: 'numeric'
                                })}
                              </div>
                            </div>
                            
                            <div className="detail-row">
                              <div className="detail-label">Status:</div>
                              <div className={`detail-value status-${candidate.status.toLowerCase()}`}>
                                {candidate.status}
                              </div>
                            </div>
                            
                            <div className="candidate-actions">
                              <button 
                                onClick={() => downloadResume(candidate.resumePath)}
                                className="action-button"
                              >
                                <Download size={16} /> Download CV
                              </button>
                            </div>
                            
                            {candidate.status === 'Selected' && (
                              <div className="skills-section">
                                <h5>Skills Match</h5>
                                <div className="skills-list">
                                  {candidate.skillsMatch?.map((skill, index) => (
                                    <span key={index} className="skill-tag match">{skill}</span>
                                  )) || <span className="no-data">Skills data not available</span>}
                                </div>
                                
                                <h5>Areas for Improvement</h5>
                                <div className="skills-list">
                                  {candidate.missingSkills?.map((skill, index) => (
                                    <span key={index} className="skill-tag missing">{skill}</span>
                                  )) || <span className="no-data">No significant skill gaps identified</span>}
                                </div>
                              </div>
                            )}
                            
                            {candidate.status === 'Rejected' && (
                              <div className="rejection-section">
                                <h5>Skills Lacking</h5>
                                <div className="skills-list">
                                  {candidate.missingSkills?.map((skill, index) => (
                                    <span key={index} className="skill-tag missing">{skill}</span>
                                  )) || <span className="no-data">Specific skills data not available</span>}
                                </div>
                              </div>
                            )}
                            
                            <div className="feedback-section">
                              <h5>
                                {candidate.status === 'Selected' ? 'Acceptance Feedback' : 
                                 candidate.status === 'Rejected' ? 'Rejection Feedback' : 'Application Feedback'}
                              </h5>
                              <div className="feedback-content">
                                {candidate.feedback || 'No feedback provided yet'}
                              </div>
                            </div>
                            
                            <div className="email-section">
                              <h5>Email Sent to Candidate</h5>
                              <div className="email-preview">
                                <FileText size={16} className="email-icon" />
                                {candidate.status === 'Selected' ? 
                                  'Acceptance email was sent to the candidate' : 
                                  candidate.status === 'Rejected' ?
                                  'Rejection email with feedback was sent to the candidate' :
                                  'Initial acknowledgment email was sent to the candidate'
                                }
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="no-selection">
              <User size={48} />
              <p>Select a job to view candidate reports</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATSReports;