import API from '../../api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/Mentor.css';

function EvaluationReports({ user }) {

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [evaluationNumber, setEvaluationNumber] = useState(1);

  const [formData, setFormData] = useState({
    technicalSkills: '',
    communication: '',
    teamwork: '',
    punctuality: '',
    attendance: '',
    projectQuality: '',
    innovation: '',
    problemSolving: '',
    overallGrade: '',
    mentorRemarks: '',
    recommendation: '',
  });

  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const usnParam = params.get('usn');
    const evalNumParam = params.get('evalNum');
    if (usnParam && students.length > 0) {
      const student = students.find(s => s.usn === usnParam);
      if (student) {
        setSelectedStudent(student);
      }
    }
    if (evalNumParam) {
      setEvaluationNumber(Number(evalNumParam));
    }
  }, [students]);

  // ================= FETCH STUDENTS =================

  const fetchStudents = async () => {

    try {

      const res = await fetch(`${API}/applications`);
      const data = await res.json();

      const assigned = data.filter(
        app =>
          app.status === 'Accepted' &&
          app.mentorUsn === user?.usn
      );

      setStudents(assigned);

    } catch (err) {

      console.error(err);
      alert('Failed to load students');

    }
  };

  // ================= SELECT STUDENT =================

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);

    setFormData({
      technicalSkills: '',
      communication: '',
      teamwork: '',
      punctuality: '',
      attendance: '',
      projectQuality: '',
      innovation: '',
      problemSolving: '',
      overallGrade: '',
      mentorRemarks: '',
      recommendation: '',
    });
  };

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // ================= SAVE =================

  const handleSave = async () => {

    if (!selectedStudent) return;

    setSaving(true);

    try {

      const res = await fetch(
        `${API}/mentor/evaluation/save`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            usn: selectedStudent.usn,
            mentorUsn: user?.usn,
            evaluationNumber,
            ...formData,
          }),
        }
      );

      const data = await res.text();

      alert(data);

    } catch (err) {

      console.error(err);
      alert('Error saving evaluation');

    } finally {

      setSaving(false);

    }
  };

  return (

    <div className="page">

      <Header showNav={true} />

      <div className="mentor-container">

        {/* HEADER */}

        <div className="page-header">

          <h2>Internship Evaluation Reports</h2>

          <button
            className="btn-back"
            onClick={() => navigate('/mentor/dashboard')}
          >
            ← Back to Dashboard
          </button>

        </div>

        {/* MAIN LAYOUT */}

        <div className="mentor-layout">

          {/* LEFT PANEL */}

          <div className="student-list-panel">

            <h3>Assigned Students</h3>

            {students.length === 0 ? (

              <p>No students assigned.</p>

            ) : (

              students.map(student => (

                <div
                  key={student._id}
                  className={`student-list-item ${
                    selectedStudent?.usn === student.usn ? 'active' : ''
                  }`}
                  onClick={() => handleSelectStudent(student)}
                >

                  <div className="student-list-avatar">
                    {student.usn.charAt(0).toUpperCase()}
                  </div>

                  <div>

                    <p className="student-list-usn">
                      {student.usn}
                    </p>

                    <p className="student-list-company">
                      {
                        student.company ||
                        student.internshipId?.company ||
                        'No Company'
                      }
                    </p>

                  </div>

                </div>

              ))

            )}

          </div>

          {/* RIGHT PANEL */}

          <div className="evaluation-panel">

            {!selectedStudent ? (

              <div className="select-prompt">
                <p>← Select a student to generate evaluation report</p>
              </div>

            ) : (

              <div className="evaluation-report-card">

                {/* STUDENT DETAILS */}

                <div className="eval-header">

                  <h2>Student Evaluation Report</h2>

                  <div className="eval-student-details">

                    <p>
                      <strong>USN:</strong> {selectedStudent.usn}
                    </p>

                    <p>
                      <strong>Company:</strong>{' '}
                      {
                        selectedStudent.company ||
                        selectedStudent.internshipId?.company
                      }
                    </p>

                    <p>
                      <strong>Mentor:</strong> {user?.usn}
                    </p>

                  </div>

                </div>

                {/* FORM */}

                <div className="eval-form-grid">

                  <div className="form-group">
                    <label>Technical Skills</label>
                    <select
                      name="technicalSkills"
                      value={formData.technicalSkills}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Average</option>
                      <option>Poor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Communication</label>
                    <select
                      name="communication"
                      value={formData.communication}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Average</option>
                      <option>Poor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Teamwork</label>
                    <select
                      name="teamwork"
                      value={formData.teamwork}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Average</option>
                      <option>Poor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Punctuality</label>
                    <select
                      name="punctuality"
                      value={formData.punctuality}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Average</option>
                      <option>Poor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Attendance (%)</label>
                    <input
                      type="number"
                      name="attendance"
                      value={formData.attendance}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Project Quality</label>
                    <select
                      name="projectQuality"
                      value={formData.projectQuality}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Average</option>
                      <option>Poor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Innovation</label>
                    <select
                      name="innovation"
                      value={formData.innovation}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Average</option>
                      <option>Poor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Problem Solving</label>
                    <select
                      name="problemSolving"
                      value={formData.problemSolving}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option>Excellent</option>
                      <option>Good</option>
                      <option>Average</option>
                      <option>Poor</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Overall Grade</label>
                    <select
                      name="overallGrade"
                      value={formData.overallGrade}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option>A+</option>
                      <option>A</option>
                      <option>B+</option>
                      <option>B</option>
                      <option>C</option>
                    </select>
                  </div>

                </div>

                {/* REMARKS */}

                <div className="form-group">

                  <label>Mentor Remarks</label>

                  <textarea
                    rows="4"
                    name="mentorRemarks"
                    value={formData.mentorRemarks}
                    onChange={handleChange}
                    placeholder="Enter detailed mentor remarks..."
                  />

                </div>

                <div className="form-group">

                  <label>Final Recommendation</label>

                  <textarea
                    rows="4"
                    name="recommendation"
                    value={formData.recommendation}
                    onChange={handleChange}
                    placeholder="Recommendation for future improvement..."
                  />

                </div>

                {/* BUTTON */}

                <button
                  className="btn-save-eval"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Evaluation Report'}
                </button>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );
}

export default EvaluationReports;





// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../../components/Header';

// import '../../styles/Mentor.css';

// function EvaluationReports({ user }) {

//   const [students, setStudents] = useState([]);
//   const [selectedStudent, setSelectedStudent] = useState(null);

//   const [evaluationNumber, setEvaluationNumber] = useState(1);

//   const [formData, setFormData] = useState({

//     technicalSkills: '',
//     communication: '',
//     teamwork: '',
//     punctuality: '',
//     innovation: '',
//     problemSolving: '',

//     marks: '',
//     attendance: '',

//     overallGrade: '',
//     mentorRemarks: '',
//     recommendation: ''

//   });

//   const [saving, setSaving] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {

//     fetchMyStudents();

//   }, []);

//   useEffect(() => {

//     if (selectedStudent) {

//       fetchEvaluation(selectedStudent.usn);

//     }

//   }, [evaluationNumber]);

//   // =========================================
//   // FETCH STUDENTS
//   // =========================================

//   const fetchMyStudents = async () => {

//     try {

//       const res = await fetch(
//         'http://localhost:5000/applications'
//       );

//       const data = await res.json();

//       const myStudents = data.filter(

//         a =>
//           a.status === 'Accepted' &&
//           a.mentorUsn === user?.usn

//       );

//       setStudents(myStudents);

//     } catch {

//       alert('Could not load students.');

//     }

//   };

//   // =========================================
//   // FETCH EVALUATION
//   // =========================================

//   const fetchEvaluation = async (usn) => {

//     try {

//       const res = await fetch(
//         `http://localhost:5000/mentor/evaluation/${usn}`
//       );

//       const data = await res.json();

//       const currentEvaluation = data.find(

//         e => e.evaluationNumber === evaluationNumber

//       );

//       if (currentEvaluation) {

//         setFormData({

//           technicalSkills:
//             currentEvaluation.technicalSkills || '',

//           communication:
//             currentEvaluation.communication || '',

//           teamwork:
//             currentEvaluation.teamwork || '',

//           punctuality:
//             currentEvaluation.punctuality || '',

//           innovation:
//             currentEvaluation.innovation || '',

//           problemSolving:
//             currentEvaluation.problemSolving || '',

//           marks:
//             currentEvaluation.marks || '',

//           attendance:
//             currentEvaluation.attendance || '',

//           overallGrade:
//             currentEvaluation.overallGrade || '',

//           mentorRemarks:
//             currentEvaluation.mentorRemarks || '',

//           recommendation:
//             currentEvaluation.recommendation || ''

//         });

//       } else {

//         setFormData({

//           technicalSkills: '',
//           communication: '',
//           teamwork: '',
//           punctuality: '',
//           innovation: '',
//           problemSolving: '',

//           marks: '',
//           attendance: '',

//           overallGrade: '',
//           mentorRemarks: '',
//           recommendation: ''

//         });

//       }

//     } catch (error) {

//       console.log(error);

//     }

//   };

//   // =========================================
//   // SELECT STUDENT
//   // =========================================

//   const handleSelectStudent = (student) => {

//     setSelectedStudent(student);

//     fetchEvaluation(student.usn);

//   };

//   // =========================================
//   // HANDLE CHANGE
//   // =========================================

//   const handleChange = (e) => {

//     setFormData({

//       ...formData,
//       [e.target.name]: e.target.value

//     });

//   };

//   // =========================================
//   // SAVE EVALUATION
//   // =========================================

//   const handleSave = async () => {

//     if (!selectedStudent) return;

//     setSaving(true);

//     try {

//       const res = await fetch(

//         'http://localhost:5000/mentor/evaluation/save',

//         {

//           method: 'POST',

//           headers: {
//             'Content-Type': 'application/json'
//           },

//           body: JSON.stringify({

//             usn: selectedStudent.usn,

//             mentorUsn: user?.usn,

//             evaluationNumber,

//             technicalSkills:
//               formData.technicalSkills,

//             communication:
//               formData.communication,

//             teamwork:
//               formData.teamwork,

//             punctuality:
//               formData.punctuality,

//             innovation:
//               formData.innovation,

//             problemSolving:
//               formData.problemSolving,

//             marks:
//               formData.marks,

//             attendance:
//               formData.attendance,

//             overallGrade:
//               formData.overallGrade,

//             mentorRemarks:
//               formData.mentorRemarks,

//             recommendation:
//               formData.recommendation

//           })

//         }

//       );

//       const data = await res.text();

//       alert(data);

//     } catch {

//       alert('Error saving evaluation.');

//     } finally {

//       setSaving(false);

//     }

//   };

//   return (

//     <div className="page">

//       <Header showNav={true} />

//       <div className="mentor-container">

//         <div className="page-header">

//           <h2>Evaluation Reports</h2>

//           <button
//             className="btn-back"
//             onClick={() =>
//               navigate('/mentor/dashboard')
//             }
//           >
//             ← Back to Dashboard
//           </button>

//         </div>

//         <div className="mentor-layout">

//           {/* LEFT PANEL */}

//           <div className="student-list-panel">

//             <h3>Assigned Students</h3>

//             {students.map(student => (

//               <div
//                 key={student._id}
//                 className={`student-list-item ${
//                   selectedStudent?.usn === student.usn
//                     ? 'active'
//                     : ''
//                 }`}
//                 onClick={() =>
//                   handleSelectStudent(student)
//                 }
//               >

//                 <div className="student-list-avatar">

//                   {student.usn
//                     .charAt(0)
//                     .toUpperCase()}

//                 </div>

//                 <div>

//                   <p className="student-list-usn">
//                     {student.usn}
//                   </p>

//                   <p className="student-list-company">
//                     {student.company ||
//                       student.internshipId?.company}
//                   </p>

//                 </div>

//               </div>

//             ))}

//           </div>

//           {/* RIGHT PANEL */}

//           <div className="evaluation-panel">

//             {!selectedStudent ? (

//               <div className="select-prompt">

//                 <p>
//                   ← Select a student
//                 </p>

//               </div>

//             ) : (

//               <div className="eval-form-container">

//                 <div className="eval-header">

//                   <h3>
//                     {selectedStudent.usn}
//                   </h3>

//                   <p>
//                     {selectedStudent.company ||
//                       selectedStudent.internshipId?.company}
//                   </p>

//                 </div>

//                 {/* Evaluation Number */}

//                 <div className="form-group">

//                   <label>
//                     Evaluation Phase
//                   </label>

//                   <select
//                     value={evaluationNumber}
//                     onChange={(e) =>
//                       setEvaluationNumber(
//                         Number(e.target.value)
//                       )
//                     }
//                   >

//                     <option value={1}>
//                       Evaluation 1
//                     </option>

//                     <option value={2}>
//                       Evaluation 2
//                     </option>

//                     <option value={3}>
//                       Evaluation 3
//                     </option>

//                   </select>

//                 </div>

//                 {/* FORM */}

//                 <div className="eval-grid">

//                   <div className="form-group">
//                     <label>Technical Skills</label>

//                     <input
//                       type="text"
//                       name="technicalSkills"
//                       value={formData.technicalSkills}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Communication</label>

//                     <input
//                       type="text"
//                       name="communication"
//                       value={formData.communication}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Teamwork</label>

//                     <input
//                       type="text"
//                       name="teamwork"
//                       value={formData.teamwork}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Punctuality</label>

//                     <input
//                       type="text"
//                       name="punctuality"
//                       value={formData.punctuality}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Innovation</label>

//                     <input
//                       type="text"
//                       name="innovation"
//                       value={formData.innovation}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Problem Solving</label>

//                     <input
//                       type="text"
//                       name="problemSolving"
//                       value={formData.problemSolving}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Marks</label>

//                     <input
//                       type="number"
//                       name="marks"
//                       value={formData.marks}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Attendance</label>

//                     <input
//                       type="number"
//                       name="attendance"
//                       value={formData.attendance}
//                       onChange={handleChange}
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>Overall Grade</label>

//                     <select
//                       name="overallGrade"
//                       value={formData.overallGrade}
//                       onChange={handleChange}
//                     >

//                       <option value="">
//                         Select Grade
//                       </option>

//                       <option value="Excellent">
//                         Excellent
//                       </option>

//                       <option value="Good">
//                         Good
//                       </option>

//                       <option value="Average">
//                         Average
//                       </option>

//                       <option value="Poor">
//                         Poor
//                       </option>

//                     </select>
//                   </div>

//                 </div>

//                 <div className="form-group">

//                   <label>
//                     Mentor Remarks
//                   </label>

//                   <textarea
//                     rows="4"
//                     name="mentorRemarks"
//                     value={formData.mentorRemarks}
//                     onChange={handleChange}
//                   />

//                 </div>

//                 <div className="form-group">

//                   <label>
//                     Recommendation
//                   </label>

//                   <textarea
//                     rows="4"
//                     name="recommendation"
//                     value={formData.recommendation}
//                     onChange={handleChange}
//                   />

//                 </div>

//                 <button
//                   className="btn-save-eval"
//                   onClick={handleSave}
//                   disabled={saving}
//                 >

//                   {saving
//                     ? 'Saving...'
//                     : 'Save Evaluation'}

//                 </button>

//               </div>

//             )}

//           </div>

//         </div>

//       </div>

//     </div>

//   );

// }

// export default EvaluationReports;
