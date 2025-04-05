// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const candidateRoutes = require("./routes/candidate"); // Import candidate routes
// const employerRoutes = require("./routes/employer"); // Import employer routes

// const app = express();

// // ✅ Middleware (Fixes req.body being undefined)
// app.use(express.json());
// app.use(cors());

// // ✅ MongoDB Connection
// mongoose
//   .connect("mongodb://localhost:27017/ats_system", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // ✅ Routes
// app.use("/api/candidates", candidateRoutes);
// app.use("/api/employers", employerRoutes);

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

mongoose.connect('mongodb://localhost:27017/profileDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const profileSchema = new mongoose.Schema({
  name: String,
  bio: String,
  preferences: String,
  cv: String
});

const Profile = mongoose.model('Profile', profileSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.get('/api/profile/:id', async (req, res) => {
  const profile = await Profile.findById(req.params.id);
  res.json(profile);
});

app.post('/api/profile/:id', async (req, res) => {
  const updated = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true, upsert: true });
  res.json(updated);
});

app.post('/api/profile/:id/upload', upload.single('cv'), async (req, res) => {
  const updated = await Profile.findByIdAndUpdate(req.params.id, { cv: req.file.filename }, { new: true });
  res.json(updated);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
