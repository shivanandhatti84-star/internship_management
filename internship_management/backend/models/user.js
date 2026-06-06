const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  usn: { type: String, required: false },
  email: { type: String, required: true },
  role: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  department: { type: String, default: '' },
  phone: { type: String, default: '' }
});

module.exports = mongoose.model("User", userSchema);
