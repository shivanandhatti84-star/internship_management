import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/Dashboard.css';

function MentorDashboard({ onLogout, user }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <Header showNav={true} onLogout={() => { onLogout(); navigate('/login'); }} />
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2>Mentor Dashboard</h2>
          <p className="dashboard-subtitle">Welcome, {user?.usn}!</p>
          <div className="dashboard-buttons">
            <button className="dashboard-btn" onClick={() => navigate('/mentor/evaluation')}>
              <span className="btn-icon">📝</span> Evaluation Reports
            </button>
            <button className="dashboard-btn" onClick={() => navigate('/mentor/communication')}>
              <span className="btn-icon">💬</span> Student Communication
            </button>
            <button className="dashboard-btn" onClick={() => navigate('/mentor/progress')}>
              <span className="btn-icon">📈</span> Evalution Scheduling
            </button>
            <button className="dashboard-btn" onClick={() => navigate('/mentor/student-profiles')}>
              <span className="btn-icon">👤</span> Student Profiles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentorDashboard;