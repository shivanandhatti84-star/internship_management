const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  usn: String,
  name: String,
  email: String,
  phone: String,
  cgpa: String,
  branch: String
});

module.exports = mongoose.model("Profile", profileSchema);