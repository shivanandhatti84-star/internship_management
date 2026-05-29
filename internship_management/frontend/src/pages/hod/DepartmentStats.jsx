import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

import '../../styles/HOD.css';

function DepartmentStats() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const [appsRes, internRes, mentorsRes] = await Promise.all([
        fetch(`http://localhost:5000/applications`),
        fetch(`http://localhost:5000/internships`),
        fetch(`http://localhost:5000/auth/mentors`),
      ]);
      const apps        = await appsRes.json();
      const internships = await internRes.json();
      const mentors     = await mentorsRes.json();
      const accepted    = apps.filter(a => a.status === 'Accepted');
      const assigned    = accepted.filter(a => a.mentorUsn).length;

      setStats({
        totalApplications: apps.length,
        accepted:          accepted.length,
        rejected:          apps.filter(a => a.status === 'Rejected').length,
        pending:           apps.filter(a => a.status === 'Pending').length,
        totalInternships:  internships.length,
        totalMentors:      mentors.length,
        assignedStudents:  assigned,
        unassignedStudents: accepted.length - assigned,
      });
    } catch { alert('Could not load stats.'); }
  };

  const Card = ({ label, value, color }) => (
    <div className={`dept-stat-card ${color}`}>
      <span className="dept-stat-number">{value}</span>
      <span className="dept-stat-label">{label}</span>
    </div>
  );

  return (
    <div className="page">
      <Header showNav={true} />
      <div className="hod-container">
        <div className="page-header">
          <h2>Department Statistics</h2>
          <button className="btn-back" onClick={() => navigate('/hod/dashboard')}>← Back to Dashboard</button>
        </div>

        {!stats ? <p>Loading...</p> : (
          <>
            <div className="dept-stats-section">
              <h3 className="section-title">Applications Overview</h3>
              <div className="dept-stats-grid">
                <Card label="Total Applications" value={stats.totalApplications} color="blue" />
                <Card label="Accepted"           value={stats.accepted}          color="green" />
                <Card label="Rejected"           value={stats.rejected}          color="red" />
                <Card label="Pending"            value={stats.pending}           color="yellow" />
              </div>
            </div>
            <div className="dept-stats-section">
              <h3 className="section-title">Internship & Mentor Overview</h3>
              <div className="dept-stats-grid">
                <Card label="Selected Students"       value={stats.totalInternships}   color="blue" />
                <Card label="Mentors Registered"       value={stats.totalMentors}       color="purple" />
                <Card label=" Mentor Assigned Students" value={stats.assignedStudents}   color="green" />
                <Card label="Students Without Mentor"  value={stats.unassignedStudents} color="yellow" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DepartmentStats;