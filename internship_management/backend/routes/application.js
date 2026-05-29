// const express = require("express");
// const router = express.Router();
// const Application = require("../models/Application");
// const Internship = require("../models/Internship");

// // APPLY
// router.post("/apply", async (req, res) => {
//   try {
//     const { usn, name, internshipId } = req.body;

//     const existing = await Application.findOne({
//       usn,
//       internshipId
//     });

//     if (existing) return res.send("Already applied");

//     const internship = await Internship.findById(internshipId);

//     if (!internship) return res.send("Internship not found");

//     if (internship.slots <= 0) return res.send("Slots full");

//     const app = new Application({
//       usn,
//       name,
//       internshipId,
//       internshipRole: internship.role,
//       status: "Pending"
//     });

//     await app.save();

//     internship.slots -= 1;
//     await internship.save();

//     res.send("Applied successfully");

//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// // GET ALL
// router.get("/", async (req, res) => {
//   const apps = await Application.find().populate("internshipId");
//   res.json(apps);
// });

// // UPDATE STATUS
// router.put("/:id", async (req, res) => {
//   try {
//     const { status } = req.body;

//     await Application.findByIdAndUpdate(
//   req.params.id,
//   { status },
//   { new: true }
// );

//     res.send("Updated");

//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// // DELETE
// router.delete("/:id", async (req, res) => {
//   try {
//     await Application.findByIdAndDelete(req.params.id);
//     res.send("Deleted");
//   } catch (err) {
//     res.status(500).send("Error");
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Application = require("../models/application");
const Internship = require("../models/Internship");

// APPLY — one application per student enforced at DB level
router.post("/apply", async (req, res) => {
  try {
    const { usn, internshipId } = req.body;

    // Check if student already applied to ANY internship
    const existing = await Application.findOne({ usn });
    if (existing) return res.send("Already applied");

    const internship = await Internship.findById(internshipId);
    if (!internship) return res.send("Internship not found");
    if (internship.slots <= 0) return res.send("Slots full");

    const app = new Application({
      usn,
      internshipId,
      company: internship.company,
      status: "Pending",
    });

    await app.save();
    internship.slots -= 1;
    await internship.save();

    res.send("Applied successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// GET ALL APPLICATIONS (coordinator / HOD)
router.get("/", async (req, res) => {
  try {
    const apps = await Application.find().populate("internshipId");
    res.json(apps);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// GET APPLICATIONS BY USN (student status page)
router.get("/my/:usn", async (req, res) => {
  try {
    const apps = await Application.find({ usn: req.params.usn }).populate("internshipId");
    res.json(apps);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// UPDATE STATUS — only if still Pending
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).send("Not found");
    if (app.status !== "Pending") {
      return res.status(400).send("Decision already finalised");
    }
    app.status = status;
    await app.save();
    res.send("Updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.send("Deleted");
  } catch (err) {
    res.status(500).send("Error");
  }
});

// ASSIGN MENTOR to a student application
router.put("/:id/assign-mentor", async (req, res) => {
  try {
    const { mentorUsn } = req.body;
    await Application.findByIdAndUpdate(req.params.id, { mentorUsn });
    res.send("Mentor assigned");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
