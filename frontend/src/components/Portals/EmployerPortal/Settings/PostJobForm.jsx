import { useState, useEffect } from "react";
import axios from "axios"; 
import "./PostJobForm.css";
import PropTypes from "prop-types";

const PostJobForm = ({ jobToEdit, onJobSaved }) => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-Time",
    description: "",
    requirements: "",
    salary: "",
  });

  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        title: jobToEdit.title || "",
        company: jobToEdit.company || "",
        location: jobToEdit.location || "",
        type: jobToEdit.type || "Full-Time",
        description: jobToEdit.description || "",
        requirements: jobToEdit.skillsRequired ? jobToEdit.skillsRequired.join(", ") : "",
        salary: jobToEdit.salaryRange || "",
      });
    } else {
      setFormData({
        title: "",
        company: "",
        location: "",
        type: "Full-Time",
        description: "",
        requirements: "",
        salary: "",
      });
    }
  }, [jobToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        skillsRequired: formData.requirements.split(",").map(skill => skill.trim()), 
        location: formData.location,
        salaryRange: formData.salary,
      };
  
      let response;
      
      if (jobToEdit) {
        response = await axios.put(`http://localhost:5000/api/jobs/${jobToEdit._id}`, jobData);
        alert("Job Updated: " + response.data.message);
      } else {
        response = await axios.post("http://localhost:5000/api/jobs/post", jobData);
        alert("Job Posted: " + response.data.message);
      }
  
      setFormData({
        title: "",
        company: "",
        location: "",
        type: "Full-Time",
        description: "",
        requirements: "",
        salary: "",
      });
  
      if (onJobSaved) {
        onJobSaved();
      }
      
    } catch (error) {
      console.error("Error saving job:", error);
      alert(`Failed to ${jobToEdit ? 'update' : 'post'} the job. Please try again.`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 text-black">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {jobToEdit ? '✏️ Edit Job Posting' : '📝 Post a New Job'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex">
          <div>
            <label className="block mb-1 font-medium">Job Title</label>
            <input
              type="text"
              name="title"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Company</label>
            <input
              type="text"
              name="company"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex">
          <div className="w-1/2">
            <label className="block mb-1 font-medium">Location</label>
            <input
              type="text"
              name="location"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1 font-medium">Job Type</label>
            <select
              name="type"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={formData.type}
              onChange={handleChange}
            >
              <option>Full-Time</option>
              <option>Part-Time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Remote</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Job Description</label>
          <textarea
            name="description"
            rows="4"
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">Requirements</label>
          <textarea
            name="requirements"
            rows="3"
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={formData.requirements}
            onChange={handleChange}
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">Salary (Optional)</label>
          <input
            type="text"
            name="salary"
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-between">
          {jobToEdit && (
            <button
              type="button"
              onClick={() => {
                if (onJobSaved) onJobSaved(); 
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            {jobToEdit ? 'Update Job' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  );
};
PostJobForm.propTypes = {
  jobToEdit: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    company: PropTypes.string,
    location: PropTypes.string,
    type: PropTypes.string,
    description: PropTypes.string,
    skillsRequired: PropTypes.arrayOf(PropTypes.string),
    salaryRange: PropTypes.string,
  }),
  onJobSaved: PropTypes.func,
};

export default PostJobForm;