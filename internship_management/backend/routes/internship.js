const express = require("express");
const router = express.Router();

const Internship = require("../models/Internship");


// ============================
// ADD INTERNSHIP
// POST /internships/add
// ============================
router.post("/add", async (req, res) => {
  try {
    const { company, location, duration, startDate, stipend, slots, description } = req.body;
    const stipendAmount = Number(stipend);
    const slotCount = Number(slots);

    if (!company || !duration || !startDate) {
      return res.status(400).send("Company, duration, and start date are required");
    }

    if (!Number.isFinite(stipendAmount) || stipendAmount < 0) {
      return res.status(400).send("Stipend must be a valid number");
    }

    if (!Number.isInteger(slotCount) || slotCount < 1) {
      return res.status(400).send("Slots must be at least 1");
    }

    const internship = new Internship({
      company,
      location,
      duration,
      startDate,
      stipend: stipendAmount,
      slots: slotCount,
      description
    });
    await internship.save();

    res.send("Internship added successfully");
  } catch (error) {
    console.error("Error adding internship:", error);
    if (error.name === "ValidationError") {
      return res.status(400).send(error.message);
    }
    res.status(500).send(error.message || "Error adding internship");
  }
});


// ============================
// GET ALL INTERNSHIPS
// GET /internships
// ============================
router.get("/", async (req, res) => {
  try {
    const data = await Internship.find();
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching internships");
  }
});


// ============================
// DELETE INTERNSHIP
// DELETE /internships/:id
// ============================
router.delete("/:id", async (req, res) => {
  try {
    await Internship.findByIdAndDelete(req.params.id);
    res.send("Internship deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error deleting internship");
  }
});


// ============================
// UPDATE INTERNSHIP
// PUT /internships/:id
// ============================
router.put("/:id", async (req, res) => {
  try {
    await Internship.findByIdAndUpdate(req.params.id, req.body);
    res.send("Internship updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error updating internship");
  }
});

module.exports = router;
