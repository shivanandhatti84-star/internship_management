const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema({
  company: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String, required: true },
  startDate: { type: String, required: true },
  stipend: { type: Number, required: true },
  slots: { type: Number, required: true },
  description: { type: String, default: "" }
});

module.exports = mongoose.model("Internship", internshipSchema);