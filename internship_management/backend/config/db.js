const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/internship_portal");
    console.log("Local MongoDB Connected ✅");
    try {
      await mongoose.connection.db.collection("evaluations").dropIndex("usn_1");
      console.log("Dropped unique index evaluations.usn_1 ✅");
    } catch (e) {
      // index might not exist
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;


// require('dotenv').config();
// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB Connected ✅");
//     try {
//       await mongoose.connection.db.collection("evaluations").dropIndex("usn_1");
//       console.log("Dropped unique index evaluations.usn_1 ✅");
//     } catch (e) {
//       // index might not exist
//     }
//   } catch (err) {
//     console.log(err);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;