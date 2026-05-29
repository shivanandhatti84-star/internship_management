


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

import '../../styles/Mentor.css';

function StudentProgress({ user }) {

  const [students, setStudents] = useState([]);

  const [evaluations, setEvaluations] = useState({});
  const [scheduleTimes, setScheduleTimes] = useState({});

  const navigate = useNavigate();

  const handleScheduleTimeChange = (usn, phase, val) => {
    setScheduleTimes(prev => ({
      ...prev,
      [`${usn}-${phase}`]: val
    }));
  };

  const handleScheduleSubmit = async (usn, phase) => {
    const scheduledAt = scheduleTimes[`${usn}-${phase}`];
    if (!scheduledAt) {
      alert("Please select a date and time first!");
      return;
    }
    try {
      const res = await fetch('https://internship-management-uhf3.onrender.com/mentor/evaluation/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usn,
          mentorUsn: user?.usn,
          evaluationNumber: phase,
          scheduledAt
        })
      });
      if (res.ok) {
        alert(`Evaluation ${phase} scheduled successfully!`);
        fetchEvaluations(usn);
      } else {
        alert("Failed to schedule evaluation.");
      }
    } catch (err) {
      console.error(err);
      alert("Error scheduling evaluation.");
    }
  };

  useEffect(() => {

    fetchMyStudents();

  }, []);

  // =========================================
  // FETCH STUDENTS
  // =========================================

  const fetchMyStudents = async () => {

    try {

      const res = await fetch(
        'https://internship-management-uhf3.onrender.com/applications'
      );

      const data = await res.json();

      const myStudents = data.filter(

        a =>
          a.status === 'Accepted' &&
          a.mentorUsn === user?.usn

      );

      setStudents(myStudents);

      myStudents.forEach(student => {

        fetchEvaluations(student.usn);

      });

    } catch {

      alert('Could not load students.');

    }

  };

  // =========================================
  // FETCH ALL EVALUATIONS
  // =========================================

  const fetchEvaluations = async (usn) => {

    try {

      const res = await fetch(

        `https://internship-management-uhf3.onrender.com/mentor/evaluation/${usn}`

      );

      const data = await res.json();

      setEvaluations(prev => ({

        ...prev,
        [usn]: data

      }));

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <div className="page">

      <Header showNav={true} />

      <div className="mentor-container">

        <div className="page-header">

          <h2>Student Progress</h2>

          <button
            className="btn-back"
            onClick={() =>
              navigate('/mentor/dashboard')
            }
          >
            ← Back to Dashboard
          </button>

        </div>

        <div className="progress-cards">

          {students.map(student => {

            return (

              <div
                key={student._id}
                className="progress-card"
              >

                <div className="progress-card-header">

                  <div className="progress-avatar">

                    {student.usn
                      .charAt(0)
                      .toUpperCase()}

                  </div>

                  <div className="student-info">

                    <h3>{student.usn}</h3>

                    <p className="student-company">
                      {student.company ||
                        student.internshipId?.company ||
                        'No Company'}
                    </p>

                  </div>

                </div>

                <div className="evaluations-phases-container">

                  {[1, 2, 3].map(phase => {
                    const evList = evaluations[student.usn] || [];
                    const ev = evList.find(e => e.evaluationNumber === phase);

                    const isScheduled = !!ev && !!ev.scheduledAt;
                    const isReportFilled = !!ev && !!ev.technicalSkills;
                    const isPast = isScheduled && new Date(ev.scheduledAt) <= new Date();

                    return (
                      <div key={phase} className="evaluation-phase-block">
                        
                        <div className="phase-header-row">
                          <h4>Evaluation {phase}</h4>
                          {isReportFilled && (
                            <span className="phase-grade-pill">Grade: {ev.overallGrade || 'N/A'}</span>
                          )}
                        </div>

                        {!isScheduled ? (
                          <div className="scheduling-section">
                            <p className="schedule-status-msg">Not Scheduled Yet</p>
                            <div className="schedule-inputs">
                              <input
                                type="datetime-local"
                                className="schedule-datetime-input"
                                value={scheduleTimes[`${student.usn}-${phase}`] || ''}
                                onChange={e => handleScheduleTimeChange(student.usn, phase, e.target.value)}
                              />
                              <button
                                className="btn-schedule-eval"
                                onClick={() => handleScheduleSubmit(student.usn, phase)}
                              >
                                Schedule
                              </button>
                            </div>
                          </div>
                        ) : !isReportFilled ? (
                          <div className="scheduled-waiting-section">
                            <p className="schedule-status-msg">
                              📅 Scheduled for: <strong>{new Date(ev.scheduledAt).toLocaleString('en-IN')}</strong>
                            </p>
                            {!isPast ? (
                              <div className="locked-badge-container">
                                <span className="locked-badge">🔒 Locked</span>
                                <span className="locked-reason">Fill report after scheduled time.</span>
                              </div>
                            ) : (
                              <button
                                className="btn-go-eval"
                                onClick={() => navigate(`/mentor/evaluation?usn=${student.usn}&evalNum=${phase}`)}
                              >
                                Fill Evaluation Report →
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="progress-stats">
                            
                            {/* Attendance */}
                            <div className="progress-attendance-box">
                              <div className="attendance-header">
                                <span>Attendance</span>
                                <strong>{ev.attendance}%</strong>
                              </div>
                              <div className="progress-bar-bg">
                                <div
                                  className="progress-bar-fill"
                                  style={{
                                    width: `${ev.attendance}%`,
                                    background: ev.attendance >= 85 ? '#10b981' : ev.attendance >= 75 ? '#f59e0b' : '#ef4444'
                                  }}
                                />
                              </div>
                            </div>

                            {/* Criteria Grid */}
                            <div className="criteria-grid">
                              <div className="criteria-item">
                                <span className="criteria-label">Technical Skills</span>
                                <span className={`rating-badge badge-${ev.technicalSkills?.toLowerCase() || 'average'}`}>
                                  {ev.technicalSkills || 'N/A'}
                                </span>
                              </div>
                              <div className="criteria-item">
                                <span className="criteria-label">Communication</span>
                                <span className={`rating-badge badge-${ev.communication?.toLowerCase() || 'average'}`}>
                                  {ev.communication || 'N/A'}
                                </span>
                              </div>
                              <div className="criteria-item">
                                <span className="criteria-label">Teamwork</span>
                                <span className={`rating-badge badge-${ev.teamwork?.toLowerCase() || 'average'}`}>
                                  {ev.teamwork || 'N/A'}
                                </span>
                              </div>
                              <div className="criteria-item">
                                <span className="criteria-label">Punctuality</span>
                                <span className={`rating-badge badge-${ev.punctuality?.toLowerCase() || 'average'}`}>
                                  {ev.punctuality || 'N/A'}
                                </span>
                              </div>
                              <div className="criteria-item">
                                <span className="criteria-label">Project Quality</span>
                                <span className={`rating-badge badge-${ev.projectQuality?.toLowerCase() || 'average'}`}>
                                  {ev.projectQuality || 'N/A'}
                                </span>
                              </div>
                              <div className="criteria-item">
                                <span className="criteria-label">Innovation</span>
                                <span className={`rating-badge badge-${ev.innovation?.toLowerCase() || 'average'}`}>
                                  {ev.innovation || 'N/A'}
                                </span>
                              </div>
                              <div className="criteria-item">
                                <span className="criteria-label">Problem Solving</span>
                                <span className={`rating-badge badge-${ev.problemSolving?.toLowerCase() || 'average'}`}>
                                  {ev.problemSolving || 'N/A'}
                                </span>
                              </div>
                            </div>

                            {ev.mentorRemarks && (
                              <div className="progress-detail">
                                <span className="detail-label">Mentor Remarks</span>
                                <p className="detail-value">"{ev.mentorRemarks}"</p>
                              </div>
                            )}

                            {ev.recommendation && (
                              <div className="progress-detail recommendation-detail">
                                <span className="detail-label">Final Recommendation</span>
                                <p className="detail-value">{ev.recommendation}</p>
                              </div>
                            )}

                          </div>
                        )}

                      </div>
                    );
                  })}

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>

  );

}

export default StudentProgress;
