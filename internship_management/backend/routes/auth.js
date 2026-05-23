// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");


// router.get("/", (req, res) => {
//   res.send("Auth route working ✅");
// });
// // REGISTER
// router.post("/register", async (req, res) => {
//   const { usn, role, password } = req.body;

//   const user = new User({ usn, role, password });
//   await user.save();

//   res.send("Registered");
// });

// // LOGIN
// router.post("/login", async (req, res) => {
//   const { usn, role, password } = req.body;

//   const user = await User.findOne({ usn, role });

//   if (!user) return res.send("Not registered");

//   if (user.password !== password)
//     return res.send("Password mismatch");

//   res.send("Login success");
// });

// module.exports = router;






// ================= REGISTER =================
// router.post("/register", async (req, res) => {
//   try {
//     const { usn, email, role, password } = req.body;

//     // CHECK EXISTING USER
//     let user = await User.findOne({ usn, role });

//     if (user) {
//       return res.send("User already registered");
//     }

//     // CREATE NEW USER
//     const newUser = new User({
//       usn,
//       email,
//       role,
//       password
//     });

//     await newUser.save();

//     res.send("Registered successfully");

//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

// // ================= LOGIN =================
// router.post("/login", async (req, res) => {
//   try {
//     const { usn, role, password } = req.body;

//     // CHECK USER
//     let user = await User.findOne({ usn, role });

//     // ❌ USER NOT FOUND (USN or role wrong)
//     if (!user) {
//       return res.send("User not found");
//     }

//     // ❌ PASSWORD WRONG
//     if (user.password !== password) {
//       return res.send("Wrong password");
//     }

//     // ✅ SUCCESS
//     res.send("Login success");

//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });





const express = require("express");
const router = express.Router();
const User = require("../models/User");


// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { usn, email, role, password } = req.body;
    let user = await User.findOne({ usn, role });
    if (user) return res.send("User already registered");
    const newUser = new User({ usn, email, role, password });
    await newUser.save();
    res.send("Registered successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { usn, role, password } = req.body;
    let user = await User.findOne({ usn, role });
    if (!user) return res.send("User not found");
    if (user.password !== password) return res.send("Wrong password");
    res.send("Login success");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// GET ALL MENTORS — used by HOD to assign mentors to students
router.get("/mentors", async (req, res) => {
  try {
    const mentors = await User.find({ role: "mentor" }, { usn: 1, email: 1, name: 1, _id: 0 });
    res.json(mentors);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// GET user by USN (no password)
router.get('/user/:usn', async (req, res) => {
  try {
    const user = await User.findOne({ usn: req.params.usn }, { password: 0, _id: 0 });
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// UPDATE user profile (by USN) — used by mentors to save profile
router.put('/user/:usn', async (req, res) => {
  try {
    const { name, department, phone, email } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (department !== undefined) update.department = department;
    if (phone !== undefined) update.phone = phone;
    if (email !== undefined) update.email = email;

    const user = await User.findOneAndUpdate({ usn: req.params.usn }, update, { new: true });
    if (!user) return res.status(404).send('User not found');
    res.send('Profile updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
