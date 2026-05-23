// const mongoose = require("mongoose");

// const applicationSchema = new mongoose.Schema({
//   usn: String,
//   name: String,
//   internshipId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Internship"
//   },
//   internshipRole: String,
//   status: String
// }, { timestamps: true });

// module.exports = mongoose.model("Application", applicationSchema);


const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  usn:          { type: String, required: true, unique: true }, // unique = one app per student
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
  company:      { type: String },
  status:       { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  mentorUsn:    { type: String, default: null }, // assigned by HOD
  appliedDate:  { type: Date, default: Date.now }
});

module.exports = mongoose.model("Application", applicationSchema);