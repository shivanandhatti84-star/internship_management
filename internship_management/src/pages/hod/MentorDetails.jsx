import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

import '../../styles/HOD.css';

function MentorDetails() {
  const [mentors, setMentors] = useState([]);
  const [acceptedApps, setAcceptedApps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { fetchMentors(); fetchAccepted(); }, []);

  const fetchMentors = async () => {
    try { const res = await fetch(`http://localhost:5000/auth/mentors`); setMentors(await res.json()); }
    catch { alert('Could not load mentors.'); }
  };

  const fetchAccepted = async () => {
    try {
      const res = await fetch(`http://localhost:5000/applications`);
      const data = await res.json();
      setAcceptedApps(data.filter(a => a.status === 'Accepted'));
    } catch { alert('Could not load applications.'); }
  };

  const getStudentsForMentor = (usn) => acceptedApps.filter(a => a.mentorUsn === usn);

  return (
    <div className="page">
      <Header showNav={true} />
      <div className="hod-container">
        <div className="page-header">
          <h2>Mentor Details</h2>
          <button className="btn-back" onClick={() => navigate('/hod/dashboard')}>← Back to Dashboard</button>
        </div>

        {mentors.length === 0 ? (
          <div className="empty-state"><p>No mentors registered yet.</p></div>
        ) : (
          <div className="mentor-cards">
            {mentors.map(mentor => {
              const students = getStudentsForMentor(mentor.usn);
              return (
                <div key={mentor.usn} className="mentor-card">
                  <div className="mentor-card-header">
                    <div className="mentor-avatar">{mentor.usn.charAt(0).toUpperCase()}</div>
                    <div>
                      <h3>{mentor.usn}</h3>
                      <p className="mentor-email">{mentor.email || '—'}</p>
                    </div>
                    <span className="student-count-badge">{students.length} student{students.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="mentor-card-body">
                    {students.length === 0 ? (
                      <p className="no-students-text">No students assigned yet.</p>
                    ) : (
                      <table className="students-mini-table">
                        <thead>
                          <tr>
                            <th>Serial No.</th>
                            <th>USN</th>
                            <th>Company</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((s, index) => (
                            <tr key={s._id}>
                              <td>{index + 1}</td>
                              <td>{s.usn || '—'}</td>
                              <td>{s.company || s.internshipId?.company || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MentorDetails;