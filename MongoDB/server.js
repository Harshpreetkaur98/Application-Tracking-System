const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const candidateRoutes = require("./routes/candidate"); // Import candidate routes
const employerRoutes = require("./routes/employer"); // Import employer routes

const app = express();

// ✅ Middleware (Fixes req.body being undefined)
app.use(express.json());
app.use(cors());

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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
