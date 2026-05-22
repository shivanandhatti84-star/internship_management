import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/Dashboard.css';

function StudentDashboard({ onLogout, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const goToInternships = () => navigate('/student/internships');
  const goToStatus = () => navigate('/student/status');
  const goToProfile = () => navigate('/student/profile');

  return (
    <div className="dashboard-page">
      <Header showNav={true} onLogout={handleLogout} />
      
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2>Student Dashboard</h2>
          <p className="dashboard-subtitle">Welcome, {user?.usn}!</p>
          
          <div className="dashboard-buttons">
            <button className="dashboard-btn" onClick={goToInternships}>
              <span className="btn-icon">📋</span>
              View Internships
            </button>
            
            <button className="dashboard-btn" onClick={goToStatus}>
              <span className="btn-icon">📊</span>
              Application Status
            </button>
            
            <button className="dashboard-btn" onClick={goToProfile}>
              <span className="btn-icon">👤</span>
              My Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;