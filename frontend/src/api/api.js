import axios from 'axios';

// Base URL for the API
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// 🟢 Candidate Login
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/candidates/login', { email, password });
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || 'Something went wrong';
  }
};

// 🟢 Employer Login (Fixed: Added password field)
export const loginEmployer = async (email, password) => {
  try {
    const response = await api.post('/employers/login', { email, password });
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || 'Something went wrong';
  }
};

// 🟢 Register Candidate
export const registerCandidate = async (email, password) => {
  try {
    const response = await api.post("/candidates/register", { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Registration failed";
  }
};

export const registerEmployer = async (email, password) => {
  try {
    const response = await api.post("/employers/register", { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : "Registration failed";
  }
};


// 🟢 Get all jobs
export const getJobs = async () => {
  try {
    const response = await api.get('/jobs');
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || 'Error fetching jobs';
  }
};
