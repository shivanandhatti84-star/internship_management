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
          app.mentorUsn === (user?.name || user?.usn)
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
            mentorUsn: user?.name || user?.usn,
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
                      <strong>Mentor:</strong> {user?.name || user?.usn}
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
