const express = require("express");
const Job = require("../models/job"); // Import Job model
const mongoose = require("mongoose");

const router = express.Router();

// Hardcoded employer ID (use the new keyword to instantiate ObjectId)
const hardCodedEmployerId = new mongoose.Types.ObjectId("60d5f7e7b7f11b2e6c1dff23"); // Correct usage

// Fetch all jobs
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find(); // Fetch jobs from the database
    res.status(200).json({ jobs }); // Return the list of jobs as JSON
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err.message });
  }
});

// ✅ Job Posting Route
router.post("/post", async (req, res) => {
  try {
    const { title, description, skillsRequired, location, salaryRange } = req.body;

    // ✅ Check if all required fields are provided
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    // ✅ Create a new job document with the hardcoded employerId
    const newJob = new Job({
      employerId: hardCodedEmployerId,  // Use the hardcoded employer ID
      title,
      description,
      skillsRequired: skillsRequired || [],
      location,
      salaryRange,
    });

    // ✅ Save the job to the database
    await newJob.save();

    // ✅ Return success message
    res.status(201).json({
      message: "Job posted successfully",
      job: newJob,
    });
  } catch (err) {
    res.status(500).json({ message: "Error posting job", error: err.message });
  }
});

// Update job by ID
router.put("/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    const { title, description, skillsRequired, location, salaryRange } = req.body;

    // Check if all required fields are provided
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    // Find and update the job
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        title,
        description,
        skillsRequired: skillsRequired || [],
        location,
        salaryRange,
        updatedAt: Date.now(),
      },
      { new: true } // Return the updated document
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating job", error: err.message });
  }
});

// Delete job by ID
router.delete("/:id", async (req, res) => {
  try {
    const jobId = req.params.id;

    // Find and delete the job
    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      message: "Job deleted successfully",
      job: deletedJob,
    });
  } catch (err) {
    res.status(500).json({ message: "Error deleting job", error: err.message });
  }
});

module.exports = router;