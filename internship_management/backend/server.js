// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const profileRoutes = require("./routes/profile");
// const Evaluation = require('./models/Evaluation');

// const app = express();

// connectDB();

// app.use(cors());
// app.use(express.json());

// app.use("/auth", require("./routes/auth"));
// app.use("/internships", require("./routes/internship"));
// app.use("/applications", require("./routes/application"));
// app.use("/profile", profileRoutes);


// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });




// const express = require("express");
// const cors = require("cors");

// const connectDB = require("./config/db");

// const profileRoutes = require("./routes/profile");

// const Evaluation = require('./models/Evaluation');

// const app = express();






// // ================= DATABASE =================

// connectDB();

// // ================= MIDDLEWARE =================

// app.use(cors());
// app.use(express.json());

// // ================= ROUTES =================

// app.use("/auth", require("./routes/auth"));

// app.use("/internships", require("./routes/internship"));

// app.use("/applications", require("./routes/application"));

// app.use("/profile", profileRoutes);
// app.use("/mentor",       require("./routes/mentor"));   





// // =============================================
// // SAVE EVALUATION
// // =============================================

// app.post('/mentor/evaluation/save', async (req, res) => {

//     try {

//         const {

//             usn,
//             mentorUsn,
//             evaluationNumber,

//             technicalSkills,
//             communication,
//             teamwork,
//             punctuality,
//             innovation,
//             problemSolving,

//             marks,
//             attendance,

//             overallGrade,
//             mentorRemarks,
//             recommendation

//         } = req.body;

//         // CHECK IF SAME EVALUATION ALREADY EXISTS

//         let existingEvaluation = await Evaluation.findOne({

//             usn,
//             evaluationNumber

//         });

//         // UPDATE EXISTING

//         if (existingEvaluation) {

//             existingEvaluation.mentorUsn = mentorUsn;

//             existingEvaluation.technicalSkills = technicalSkills;
//             existingEvaluation.communication = communication;
//             existingEvaluation.teamwork = teamwork;
//             existingEvaluation.punctuality = punctuality;
//             existingEvaluation.innovation = innovation;
//             existingEvaluation.problemSolving = problemSolving;

//             existingEvaluation.marks = marks;
//             existingEvaluation.attendance = attendance;

//             existingEvaluation.overallGrade = overallGrade;
//             existingEvaluation.mentorRemarks = mentorRemarks;
//             existingEvaluation.recommendation = recommendation;

//             await existingEvaluation.save();

//             return res.send('Evaluation updated successfully');
//         }

//         // CREATE NEW EVALUATION

//         const evaluation = new Evaluation({

//             usn,
//             mentorUsn,
//             evaluationNumber,

//             technicalSkills,
//             communication,
//             teamwork,
//             punctuality,
//             innovation,
//             problemSolving,

//             marks,
//             attendance,

//             overallGrade,
//             mentorRemarks,
//             recommendation

//         });

//         await evaluation.save();

//         res.send('Evaluation saved successfully');

//     } catch (error) {

//         console.log(error);

//         res.status(500).send('Failed to save evaluation');

//     }

// });

// // =============================================
// // GET ALL EVALUATIONS OF A STUDENT
// // =============================================

// app.get('/mentor/evaluation/:usn', async (req, res) => {

//     try {

//         const evaluations = await Evaluation.find({

//             usn: req.params.usn

//         }).sort({ evaluationNumber: 1 });

//         res.json(evaluations);

//     } catch (error) {

//         console.log(error);

//         res.status(500).send('Error loading evaluations');

//     }

// });
// // ================= SERVER =================

// app.listen(5000, () => {

//     console.log("Server running on port 5000");

// });



require('dotenv').config();

const express = require("express");
const cors = require("cors");
const path = require('path');

const connectDB = require("./config/db");

const profileRoutes = require("./routes/profile");

const Evaluation = require('./models/Evaluation');

const app = express();

// ================= DATABASE =================

connectDB();

// ================= MIDDLEWARE =================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================= ROUTES =================

app.use("/auth", require("./routes/auth"));

app.use("/internships", require("./routes/internship"));

app.use("/applications", require("./routes/application"));

app.use("/profile", profileRoutes);
app.use("/mentor", require("./routes/mentor"));

// ================= ERROR HANDLING =================

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON payload received:', err.message);
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next(err);
});

// =============================================
// SAVE EVALUATION
// =============================================

app.post('/mentor/evaluation/save', async (req, res) => {

    try {

        const {

            usn,
            mentorUsn,
            evaluationNumber,

            technicalSkills,
            communication,
            teamwork,
            punctuality,
            innovation,
            problemSolving,

            marks,
            attendance,

            overallGrade,
            mentorRemarks,
            recommendation

        } = req.body;

        // CHECK IF SAME EVALUATION ALREADY EXISTS

        let existingEvaluation = await Evaluation.findOne({

            usn,
            evaluationNumber

        });

        // UPDATE EXISTING

        if (existingEvaluation) {

            existingEvaluation.mentorUsn = mentorUsn;

            existingEvaluation.technicalSkills = technicalSkills;
            existingEvaluation.communication = communication;
            existingEvaluation.teamwork = teamwork;
            existingEvaluation.punctuality = punctuality;
            existingEvaluation.innovation = innovation;
            existingEvaluation.problemSolving = problemSolving;

            existingEvaluation.marks = marks;
            existingEvaluation.attendance = attendance;

            existingEvaluation.overallGrade = overallGrade;
            existingEvaluation.mentorRemarks = mentorRemarks;
            existingEvaluation.recommendation = recommendation;

            await existingEvaluation.save();

            return res.send('Evaluation updated successfully');
        }

        // CREATE NEW EVALUATION

        const evaluation = new Evaluation({

            usn,
            mentorUsn,
            evaluationNumber,

            technicalSkills,
            communication,
            teamwork,
            punctuality,
            innovation,
            problemSolving,

            marks,
            attendance,

            overallGrade,
            mentorRemarks,
            recommendation

        });

        await evaluation.save();

        res.send('Evaluation saved successfully');

    } catch (error) {

        console.log(error);

        res.status(500).send('Failed to save evaluation');

    }

});

// =============================================
// GET ALL EVALUATIONS OF A STUDENT
// =============================================

app.get('/mentor/evaluation/:usn', async (req, res) => {

    try {

        const evaluations = await Evaluation.find({

            usn: req.params.usn

        }).sort({ evaluationNumber: 1 });

        res.json(evaluations);

    } catch (error) {

        console.log(error);

        res.status(500).send('Error loading evaluations');

    }

});

// ================= SERVER =================

app.listen(5000, () => {

    console.log("Server running on port 5000");

});