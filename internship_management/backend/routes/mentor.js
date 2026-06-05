// const express = require("express");
// const router  = express.Router();
// const Evaluation = require("../models/Evaluation");

// // ============================
// // SAVE / UPDATE EVALUATION
// // POST /mentor/evaluation/save
// // ============================
// router.post("/evaluation/save", async (req, res) => {
//   try {
//     const {
//       usn, mentorUsn,
//       technicalSkills, communication, teamwork, punctuality,
//       attendance, projectQuality, innovation, problemSolving,
//       overallGrade, mentorRemarks, recommendation,
//     } = req.body;

//     if (!usn || !mentorUsn) {
//       return res.status(400).send("USN and mentorUsn are required");
//     }

//     const existing = await Evaluation.findOne({ usn });

//     if (existing) {
//       await Evaluation.updateOne({ usn }, {
//         mentorUsn, technicalSkills, communication, teamwork,
//         punctuality, attendance, projectQuality, innovation,
//         problemSolving, overallGrade, mentorRemarks, recommendation,
//       });
//       return res.send("Evaluation updated successfully");
//     }

//     const evaluation = new Evaluation({
//       usn, mentorUsn,
//       technicalSkills, communication, teamwork, punctuality,
//       attendance, projectQuality, innovation, problemSolving,
//       overallGrade, mentorRemarks, recommendation,
//     });

//     await evaluation.save();
//     res.send("Evaluation saved successfully");

//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// // ============================
// // GET EVALUATION BY STUDENT USN
// // GET /mentor/evaluation/:usn
// // ============================
// router.get("/evaluation/:usn", async (req, res) => {
//   try {
//     const evaluation = await Evaluation.findOne({ usn: req.params.usn });
//     if (!evaluation) return res.json(null);
//     res.json(evaluation);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// // ============================
// // SEND MESSAGE TO STUDENT
// // POST /mentor/messages/send
// // ============================
// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema({
//   mentorUsn:  { type: String, required: true },
//   studentUsn: { type: String, required: true },
//   message:    { type: String, required: true },
// }, { timestamps: true });

// const Message = mongoose.model("Message", messageSchema);

// router.post("/messages/send", async (req, res) => {
//   try {
//     const { mentorUsn, studentUsn, message } = req.body;

//     if (!mentorUsn || !studentUsn || !message) {
//       return res.status(400).send("All fields are required");
//     }

//     const msg = new Message({ mentorUsn, studentUsn, message });
//     await msg.save();

//     res.send("Message sent");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// // ============================
// // GET MESSAGES FOR A STUDENT
// // GET /mentor/messages/:studentUsn
// // ============================
// router.get("/messages/:studentUsn", async (req, res) => {
//   try {
//     const messages = await Message.find({
//       studentUsn: req.params.studentUsn,
//     }).sort({ createdAt: 1 });

//     res.json(messages);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;



const express = require("express");
const router  = express.Router();
const Evaluation = require("../models/Evaluation");
const User = require("../models/user");
const { sendEvaluationScheduledEmail } = require("../utils/emailHelper");

// ============================
// SAVE / UPDATE EVALUATION
// POST /mentor/evaluation/save
// ============================
router.post("/evaluation/save", async (req, res) => {
  try {
    const {
      usn, mentorUsn, evaluationNumber,
      technicalSkills, communication, teamwork, punctuality,
      attendance, projectQuality, innovation, problemSolving,
      overallGrade, mentorRemarks, recommendation,
    } = req.body;

    if (!usn || !mentorUsn || !evaluationNumber) {
      return res.status(400).send("USN, mentorUsn, and evaluationNumber are required");
    }

    const existing = await Evaluation.findOne({ usn, evaluationNumber });

    if (existing) {
      await Evaluation.updateOne({ usn, evaluationNumber }, {
        technicalSkills, communication, teamwork, punctuality,
        attendance, projectQuality, innovation, problemSolving,
        overallGrade, mentorRemarks, recommendation,
      });
      return res.send("Evaluation updated successfully");
    }

    const evaluation = new Evaluation({
      usn, mentorUsn, evaluationNumber,
      technicalSkills, communication, teamwork, punctuality,
      attendance, projectQuality, innovation, problemSolving,
      overallGrade, mentorRemarks, recommendation,
    });

    await evaluation.save();
    res.send("Evaluation saved successfully");

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ============================
// SCHEDULE EVALUATION
// POST /mentor/evaluation/schedule
// ============================
router.post("/evaluation/schedule", async (req, res) => {
  try {
    const { usn, mentorUsn, evaluationNumber, scheduledAt } = req.body;

    if (!usn || !mentorUsn || !evaluationNumber || !scheduledAt) {
      return res.status(400).send("USN, mentorUsn, evaluationNumber, and scheduledAt are required");
    }

    let existing = await Evaluation.findOne({ usn, evaluationNumber });

    if (existing) {
      existing.scheduledAt = new Date(scheduledAt);
      await existing.save();
    } else {
      existing = new Evaluation({
        usn, mentorUsn, evaluationNumber,
        scheduledAt: new Date(scheduledAt),
      });
      await existing.save();
    }

    // Send email notification to student asynchronously
    try {
      const student = await User.findOne({ usn });
      const mentor = await User.findOne({ usn: mentorUsn, role: "mentor" });

      if (student) {
        sendEvaluationScheduledEmail({
          studentEmail: student.email,
          studentName: student.name || student.usn,
          mentorName: mentor ? (mentor.name || mentor.usn) : "Your Mentor",
          evaluationNumber,
          scheduledAt: new Date(scheduledAt)
        }).catch(err => console.error("Error sending evaluation scheduled email:", err));
      } else {
        console.warn(`Could not find student (${usn}) user account to send evaluation scheduled email.`);
      }
    } catch (emailErr) {
      console.error("Failed to process email info for evaluation schedule:", emailErr);
    }

    res.send("Evaluation scheduled successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ============================
// GET ALL EVALUATIONS BY STUDENT USN
// GET /mentor/evaluation/:usn
// ============================
router.get("/evaluation/:usn", async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ usn: req.params.usn }).sort({ evaluationNumber: 1 });
    res.json(evaluations);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ============================
// SEND MESSAGE TO STUDENT
// POST /mentor/messages/send
// ============================
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  mentorUsn:  { type: String, required: true },
  studentUsn: { type: String, required: true },
  sender:     { type: String, required: true }, // "mentor" or "student"
  message:    { type: String, required: true },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

router.post("/messages/send", async (req, res) => {
  try {
    const { mentorUsn, studentUsn, sender, message } = req.body;

    if (!mentorUsn || !studentUsn || !sender || !message) {
      return res.status(400).send("All fields are required");
    }

    const msg = new Message({ mentorUsn, studentUsn, sender, message });
    await msg.save();

    res.send("Message sent");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// ============================
// GET MESSAGES FOR A STUDENT
// GET /mentor/messages/:studentUsn
// ============================
router.get("/messages/:studentUsn", async (req, res) => {
  try {
    const messages = await Message.find({
      studentUsn: req.params.studentUsn,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;