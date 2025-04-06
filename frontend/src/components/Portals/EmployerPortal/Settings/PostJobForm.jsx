import { useState } from "react";
import "./PostJobForm.css";

const PostJobForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-Time",
    description: "",
    requirements: "",
    salary: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Posting Job:", formData);
    // You can replace the above line with an API call
    alert("Job Posted!");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 text-black">
      <h2 className="text-2xl font-semibold mb-6 text-center">📝 Post a New Job</h2>
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

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Post Job
        </button>
      </form>
    </div>
  );
};

export default PostJobForm;
