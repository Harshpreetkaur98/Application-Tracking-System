const express = require("express");
const Job = require("../models/job"); 
const mongoose = require("mongoose");

const router = express.Router();

const hardCodedEmployerId = new mongoose.Types.ObjectId("60d5f7e7b7f11b2e6c1dff23"); 

router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find(); 
    res.status(200).json({ jobs }); 
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err.message });
  }
});

router.post("/post", async (req, res) => {
  try {
    const { title, description, skillsRequired, location, salaryRange } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const newJob = new Job({
      employerId: hardCodedEmployerId, 
      title,
      description,
      skillsRequired: skillsRequired || [],
      location,
      salaryRange,
    });

    await newJob.save();

    res.status(201).json({
      message: "Job posted successfully",
      job: newJob,
    });
  } catch (err) {
    res.status(500).json({ message: "Error posting job", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    const { title, description, skillsRequired, location, salaryRange } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

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
      { new: true } 
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

router.delete("/:id", async (req, res) => {
  try {
    const jobId = req.params.id;

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