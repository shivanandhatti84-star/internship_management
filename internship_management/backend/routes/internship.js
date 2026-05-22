const express = require("express");
const router = express.Router();

const Internship = require("../models/Internship");


// ============================
// ADD INTERNSHIP
// POST /internships/add
// ============================
router.post("/add", async (req, res) => {
  try {
    const internship = new Internship(req.body);
    await internship.save();

    res.send("Internship added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding internship");
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