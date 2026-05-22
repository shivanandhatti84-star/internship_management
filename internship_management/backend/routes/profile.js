const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ================= PROFILE SCHEMA =================
const profileSchema = new mongoose.Schema({
  usn:    { type: String, required: true, unique: true },
  name:   { type: String },
  email:  { type: String },
  phone:  { type: String },
  cgpa:   { type: Number },
  branch: { type: String, default: "CSE" },
});

const Profile = mongoose.model("Profile", profileSchema);

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