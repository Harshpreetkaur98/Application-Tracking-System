import { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, CheckCircle2, XCircle, ChevronDown, ChevronRight } from 'lucide-react';

const ATSReports = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCandidate, setExpandedCandidate] = useState(null);

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
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = (resumePath) => {
    window.open(`http://localhost:5000/${resumePath}`, '_blank');
  };

  return (
    <div className="ats-reports-container">
      <h2 className="text-2xl font-bold mb-6">ATS Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Jobs List */}
        <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Posted Jobs</h3>
          {loading ? (
            <p>Loading jobs...</p>
          ) : (
            <ul className="space-y-2">
              {jobs.map(job => (
                <li 
                  key={job._id}
                  className={`p-2 rounded cursor-pointer ${selectedJob === job._id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  onClick={() => fetchCandidates(job._id)}
                >
                  {job.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Candidates List */}
        <div className="md:col-span-3">
          {selectedJob ? (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-4">
                Candidates for: {jobs.find(j => j._id === selectedJob)?.title}
              </h3>
              
              {loading ? (
                <p>Loading candidates...</p>
              ) : (
                <div className="space-y-4">
                  {candidates.map(candidate => (
                    <div key={candidate._id} className="border rounded-lg p-4">
                      <div 
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => setExpandedCandidate(expandedCandidate === candidate._id ? null : candidate._id)}
                      >
                        <div className="flex items-center space-x-4">
                          {candidate.status === 'Selected' ? (
                            <CheckCircle2 className="text-green-500" />
                          ) : (
                            <XCircle className="text-red-500" />
                          )}
                          <span className="font-medium">{candidate.candidateName}</span>
                          <span className="text-sm text-gray-500">{candidate.candidateEmail}</span>
                        </div>
                        <div>
                          {expandedCandidate === candidate._id ? <ChevronDown /> : <ChevronRight />}
                        </div>
                      </div>

                      {expandedCandidate === candidate._id && (
                        <div className="mt-4 pl-8 space-y-3">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">Status: 
                                <span className={`ml-2 ${candidate.status === 'Selected' ? 'text-green-600' : 'text-red-600'}`}>
                                  {candidate.status}
                                </span>
                              </p>
                              <p>ATS Score: {candidate.atsScore}/100</p>
                            </div>
                            <button 
                              onClick={() => downloadResume(candidate.resumePath)}
                              className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <Download size={16} className="mr-1" /> Download CV
                            </button>
                          </div>

                          <div className="mt-2">
                            <h4 className="font-medium">Feedback:</h4>
                            <div className="bg-gray-50 p-3 rounded mt-1 whitespace-pre-line">
                              {candidate.feedback || 'No feedback provided'}
                            </div>
                          </div>

                          {candidate.status === 'Selected' && (
                            <div className="mt-2">
                              <h4 className="font-medium">Areas for Further Improvement:</h4>
                              <div className="bg-yellow-50 p-3 rounded mt-1">
                                {candidate.feedback.includes('improvement') 
                                  ? candidate.feedback.split('improvement:')[1] 
                                  : 'No specific improvement areas noted'}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">Select a job to view candidate reports</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATSReports;