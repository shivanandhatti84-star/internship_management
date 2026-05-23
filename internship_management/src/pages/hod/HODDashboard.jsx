import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/Dashboard.css';

function HODDashboard({ onLogout, user }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <Header showNav={true} onLogout={() => { onLogout(); navigate('/login'); }} />
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2>HOD Dashboard</h2>
          <p className="dashboard-subtitle">Welcome, {user?.usn}!</p>
          <div className="dashboard-buttons">
            <button className="dashboard-btn" onClick={() => navigate('/hod/mentor-details')}>
              <span className="btn-icon">👨‍🏫</span> Mentor Details
            </button>
            <button className="dashboard-btn" onClick={() => navigate('/hod/department-stats')}>
              <span className="btn-icon">📊</span> Department Statistics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HODDashboard;