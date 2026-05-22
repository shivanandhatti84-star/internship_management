// const mongoose = require('mongoose');

// const EvaluationSchema = new mongoose.Schema({

//     usn: {
//         type: String,
//         required: true
//     },

//     mentorUsn: {
//         type: String,
//         required: true
//     },

//     evaluationNumber: {
//         type: Number,
//         required: true
//     },

//     technicalSkills: String,

//     communication: String,

//     teamwork: String,

//     punctuality: String,

//     innovation: String,

//     problemSolving: String,

//     marks: Number,

//     attendance: Number,

//     overallGrade: String,

//     mentorRemarks: String,

//     recommendation: String,

//     createdAt: {
//         type: Date,
//         default: Date.now
//     }

// });

// module.exports = mongoose.model(
//     'Evaluation',
//     EvaluationSchema
// );


const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema({
  usn:             { type: String, required: true },
  mentorUsn:       { type: String, required: true },
  evaluationNumber:{ type: Number, required: true },
  scheduledAt:     { type: Date },
  technicalSkills: { type: String },
  communication:   { type: String },
  teamwork:        { type: String },
  punctuality:     { type: String },
  attendance:      { type: Number },
  projectQuality:  { type: String },
  innovation:      { type: String },
  problemSolving:  { type: String },
  overallGrade:    { type: String },
  mentorRemarks:   { type: String },
  recommendation:  { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Evaluation", evaluationSchema);