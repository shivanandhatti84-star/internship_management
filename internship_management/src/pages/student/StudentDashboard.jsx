import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/Dashboard.css';

function StudentDashboard({ onLogout, user }) {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [newScheduleNotification, setNewScheduleNotification] = useState(false);

  useEffect(() => {
    const loadEvaluations = async () => {
      if (!user?.usn) return;
      try {
        const res = await fetch(`http://localhost:5000/mentor/evaluation/${user.usn}`);
        if (!res.ok) throw new Error('Failed to load evaluations');
        const data = await res.json();
        const evaluationsData = Array.isArray(data) ? data : [];
        const scheduled = evaluationsData.filter((item) => item?.scheduledAt);
        setEvaluations(evaluationsData);

        const latestScheduledAt = scheduled
          .map((item) => item.scheduledAt)
          .sort((a, b) => new Date(b) - new Date(a))[0];

        const seenKey = localStorage.getItem(`seenEvaluationSchedule_${user.usn}`);
        setNewScheduleNotification(latestScheduledAt && seenKey !== latestScheduledAt);
      } catch (err) {
        console.error('Failed to load evaluation notifications', err);
      }
    };
    loadEvaluations();
  }, [user]);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const goToInternships = () => navigate('/student/internships');
  const goToStatus = () => navigate('/student/status');
  const goToProfile = () => navigate('/student/profile');
  const goToUpload = () => navigate('/student/profile', { state: { openUpload: true } });

  const goToEvaluationResults = () => {
    if (user?.usn) {
      const scheduled = evaluations.filter((item) => item.scheduledAt);
      const latestScheduledAt = scheduled
        .map((item) => item.scheduledAt)
        .sort((a, b) => new Date(b) - new Date(a))[0];
      if (latestScheduledAt) {
        localStorage.setItem(`seenEvaluationSchedule_${user.usn}`, latestScheduledAt);
      }
    }
    navigate('/student/evaluation-results');
  };

  return (
    <div className="dashboard-page">
      <Header showNav={true} onLogout={handleLogout} />

      {newScheduleNotification && (
        <div className="student-notification-bar">
          <div className="notification-icon">🔔</div>
          <div className="notification-content">
            <p className="notification-title">Your mentor has scheduled an evaluation.</p>
            <p className="notification-list">Open evaluation results to see the scheduled phase and details.</p>
          </div>
          <button className="notification-action" onClick={goToEvaluationResults}>
            View Results
          </button>
        </div>
      )}

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

            <button className="dashboard-btn" onClick={goToUpload}>
              <span className="btn-icon">📎</span>
              Upload Resume
            </button>

            {evaluations.length > 0 && (
              <button className="dashboard-btn" onClick={goToEvaluationResults}>
                <span className="btn-icon">📘</span>
                Evaluation Results
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;