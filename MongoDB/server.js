require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require('fs');


const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Then create resumes directory inside uploads
const resumesDir = path.join(uploadsDir, 'resumes');
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
}


const candidateRoutes = require("./routes/candidate"); // Import candidate routes
const employerRoutes = require("./routes/employer"); // Import employer routes
const jobRoutes = require("./routes/job");
const applicationRoutes = require("./routes/application");

const app = express();

// ✅ Middleware (Fixes req.body being undefined)
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// ✅ MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/ats_system", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Routes
app.use("/api/candidates", candidateRoutes);
app.use("/api/employers", employerRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));