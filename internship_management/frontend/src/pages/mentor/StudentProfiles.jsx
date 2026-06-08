/* eslint-disable react-hooks/exhaustive-deps */
import API from '../../api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

import '../../styles/Profile.css';
import '../../styles/Mentor.css';

function StudentProfiles({ user }) {

  const [students, setStudents] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {

    console.log("Logged Mentor:", user);

    fetchStudents();

  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ================= FETCH ASSIGNED STUDENTS =================

  const fetchStudents = async () => {

    try {

      const appsRes = await fetch(`${API}/applications`);
      const appsData = await appsRes.json();

      console.log("Applications:", appsData);

      const assignedStudents = appsData.filter(app => {

        console.log(
          "Checking:",
          app.mentorUsn,
          "===",
          user?.name || user?.usn
        );

        return (
          app.status === 'Accepted' &&
          app.mentorUsn === (user?.name || user?.usn)
        );

      });

      console.log("Assigned Students:", assignedStudents);

      setStudents(assignedStudents);

    } catch (err) {

      console.error(err);
      alert('Failed to load students');

    }
  };

  // ================= LOAD PROFILE =================

  const loadProfile = async (usn, studentApp) => {
    try {
      console.log("Fetching profile for:", usn);
      const res = await fetch(`${API}/profile/${usn}`);
      const data = await res.json();
      console.log("Profile Response:", data);

      let profileData = {};
      if (!data || data.message === "Profile not found") {
        profileData = {
          usn: usn,
          name: studentApp?.studentName || '',
          email: studentApp?.studentEmail || '',
          phone: '',
          cgpa: '',
          branch: '',
        };
      } else {
        profileData = data;
      }

      if (studentApp) {
        profileData.applicationCompany = studentApp.company || (studentApp.internshipId && studentApp.internshipId.company);
        profileData.internshipDetails = studentApp.internshipId || null;
      }

      setSelectedProfile(profileData);
    } catch (err) {
      console.error(err);
      alert("Could not load student profile");
    }
  };

  return (

    <div className="page">

      <Header showNav={true} />

      <div className="mentor-container">

        {/* HEADER */}

        <div className="page-header">

          <h2>Student Profiles</h2>

          <button
            className="btn-back"
            onClick={() => navigate('/mentor/dashboard')}
          >
            ← Back to Dashboard
          </button>

        </div>

        {/* MAIN LAYOUT */}

        <div
          className="mentor-layout"
          style={{
            display: 'flex',
            gap: '30px',
            alignItems: 'flex-start'
          }}
        >

          {/* LEFT PANEL */}

          <div
            className="student-list-panel"
            style={{
              width: '320px'
            }}
          >

            <h3>Assigned Students</h3>

            {students.length === 0 ? (

              <div className="empty-state">
                <p>No students assigned.</p>
              </div>

            ) : (

              students.map((student, index) => (

                <div
                  key={student._id || index}
                  className="student-list-item"
                  onClick={() => {
                    console.log("Clicked Student:", student);
                    loadProfile(student.usn, student);
                  }}
                  style={{
                    cursor: 'pointer',
                    border: selectedProfile?.usn === student.usn ? '2px solid #0f3a6a' : '1px solid #ccc',
                    boxShadow: selectedProfile?.usn === student.usn ? '0 4px 12px rgba(15, 58, 106, 0.15)' : 'none',
                    padding: '15px',
                    marginBottom: '15px',
                    borderRadius: '12px',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    transition: 'all 0.3s ease'
                  }}
                >

                  {/* AVATAR */}

                  <div
                    className="student-list-avatar"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: '#2563eb',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '20px'
                    }}
                  >
                    {(student.usn || 'S')[0].toUpperCase()}
                  </div>

                  {/* INFO */}

                  <div>

                    <p
                      className="student-list-usn"
                      style={{
                        fontWeight: 'bold',
                        margin: 0
                      }}
                    >
                      {student.usn}
                    </p>

                    <p
                      className="student-list-company"
                      style={{
                        margin: 0,
                        color: '#666'
                      }}
                    >
                    {
                    student.company ||
  student.internshipId?.company ||
  student.internship?.company ||
  'No Company'
}
                    </p>

                  </div>

                </div>

              ))

            )}

          </div>

          {/* RIGHT PANEL */}

          <div
            className="profile-container"
            style={{
              flex: 1
            }}
          >

            {!selectedProfile ? (

              <div
                className="select-prompt"
                style={{
                  padding: '50px',
                  textAlign: 'center',
                  fontSize: '20px',
                  color: '#666'
                }}
              >
                <p>← Select a student to view profile</p>
              </div>

            ) : (

              <div
                className="profile-card"
                style={{
                  background: '#fff',
                  borderRadius: '15px',
                  padding: '30px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}
              >

                {/* PROFILE HEADER */}

                <div
                  className="profile-header"
                  style={{
                    textAlign: 'center',
                    marginBottom: '30px'
                  }}
                >

                  <div
                    className="avatar"
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      background: '#2563eb',
                      color: '#fff',
                      margin: '0 auto 15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '35px',
                      fontWeight: 'bold'
                    }}
                  >
                    {(selectedProfile?.name || 'S')
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <h2>
                    {selectedProfile?.name || 'Student'}
                  </h2>

                </div>

                {/* PROFILE CONTENT */}

                <div className="profile-content">

                  <div className="profile-info">

                    <div className="info-row">
                      <span className="label">USN:</span>
                      <span className="value">
                        {selectedProfile?.usn || 'Not provided'}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="label">Name:</span>
                      <span className="value">
                        {selectedProfile?.name || 'Not provided'}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="label">Email:</span>
                      <span className="value">
                        {selectedProfile?.email || 'Not provided'}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="label">Phone:</span>
                      <span className="value">
                        {selectedProfile?.phone || 'Not provided'}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="label">CGPA:</span>
                      <span className="value">
                        {selectedProfile?.cgpa || 'Not provided'}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="label">Branch:</span>
                      <span className="value">
                        {selectedProfile?.branch || 'Not provided'}
                      </span>
                    </div>

                    {/* Company & Internship Details */}
                    <div style={{ marginTop: '30px', borderTop: '2px solid #eaedf2', paddingTop: '20px' }}>
                      <h3 style={{ color: '#0f3a6a', marginBottom: '20px', borderBottom: '2px solid #e2a32c', paddingBottom: '5px', display: 'inline-block', fontSize: '18px' }}>Company & Internship Details</h3>
                      
                      <div className="info-row">
                        <span className="label">Company Name:</span>
                        <span className="value">
                          {selectedProfile?.applicationCompany || 'Not provided'}
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="label">Location:</span>
                        <span className="value">
                          {selectedProfile?.internshipDetails?.location || 'Not provided'}
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="label">Duration:</span>
                        <span className="value">
                          {selectedProfile?.internshipDetails?.duration || 'Not provided'}
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="label">Start Date:</span>
                        <span className="value">
                          {selectedProfile?.internshipDetails?.startDate || 'Not provided'}
                        </span>
                      </div>

                      <div className="info-row">
                        <span className="label">Stipend:</span>
                        <span className="value">
                          {selectedProfile?.internshipDetails?.stipend ? `₹${selectedProfile.internshipDetails.stipend} / Month` : 'Not provided'}
                        </span>
                      </div>

                      <div className="info-row" style={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none' }}>
                        <span className="label" style={{ marginBottom: '8px' }}>Project/Internship Description:</span>
                        <span className="value" style={{ textAlign: 'left', color: '#555', fontStyle: 'italic', background: '#f9f9f9', padding: '10px', borderRadius: '6px', width: '100%', boxSizing: 'border-box' }}>
                          {selectedProfile?.internshipDetails?.description || 'No description provided.'}
                        </span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );
}

export default StudentProfiles;
