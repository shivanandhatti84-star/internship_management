const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ================= PROFILE SCHEMA =================
const profileSchema = new mongoose.Schema({
  usn:    { type: String, required: true, unique: true },
  name:   { type: String },
  email:  { type: String },
  phone:  { type: String },
  cgpa:   { type: Number },
  branch: { type: String, default: "CSE" },
  resume: {
    filename: { type: String },
    path: { type: String },
    contentType: { type: String }
  }
});

const Profile = mongoose.model("Profile", profileSchema);

// Ensure uploads directory exists
const resumesDir = path.join(__dirname, '..', 'uploads', 'resumes');
fs.mkdirSync(resumesDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resumesDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: function (req, file, cb) {
    const allowed = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF and PPT files are allowed'));
  }
});

// ================= UPLOAD RESUME =================
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const usn = req.body.usn;
    if (!usn) return res.status(400).send('USN is required');

    const file = req.file;
    if (!file) return res.status(400).send('No file uploaded');

    const update = {
      resume: {
        filename: file.filename,
        path: `/uploads/resumes/${file.filename}`,
        contentType: file.mimetype
      }
    };

    const existing = await Profile.findOne({ usn });
    if (existing) {
      await Profile.updateOne({ usn }, update);
    } else {
      const newProfile = new Profile({ usn, resume: update.resume });
      await newProfile.save();
    }

    res.send('Resume uploaded successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to upload resume');
  }
});

// ================= GET PROFILE BY USN =================
router.get("/:usn", async (req, res) => {
  try {
    const profile = await Profile.findOne({ usn: req.params.usn });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SAVE / UPDATE PROFILE =================
router.post("/save", async (req, res) => {
  try {
    const { usn, name, email, phone, cgpa, branch } = req.body;

    const existing = await Profile.findOne({ usn });

    if (existing) {
      await Profile.updateOne({ usn }, { name, email, phone, cgpa, branch });
      res.send("Profile updated successfully");
    } else {
      const newProfile = new Profile({ usn, name, email, phone, cgpa, branch });
      await newProfile.save();
      res.send("Profile saved successfully");
    }
  } catch (err) {
    res.status(500).send("Failed to save profile");
  }
});


module.exports = router;