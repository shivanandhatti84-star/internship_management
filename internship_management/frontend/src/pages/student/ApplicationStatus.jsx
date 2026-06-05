import API from '../../api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/Status.css';

function ApplicationStatus({ user }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ================= LOAD FROM DATABASE =================
  const loadApplications = async () => {
    try {
      const res = await fetch(`${API}/applications`);
      const data = await res.json();

      const userApps = data.filter(app => app.usn === user?.usn);
      setApplications(userApps);
    } catch (error) {
      console.error(error);
      alert('Failed to load applications');
    }

    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'status-accepted';
      case 'Rejected':
        return 'status-rejected';
      case 'Pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return '✓';
      case 'Rejected':
        return '✗';
      case 'Pending':
        return '⏳';
      default:
        return '';
    }
  };

  return (
    <div className="page">
      <Header showNav={true} />

      <div className="status-container">
        <div className="page-header">
          <h2>Application Status</h2>

          <button
            className="btn-back"
            onClick={() => navigate('/student/dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>Loading...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <p>You haven't applied to any internships yet.</p>

            <button
              className="btn-primary"
              onClick={() => navigate('/student/internships')}
            >
              View Available Internships
            </button>
          </div>
        ) : (
          <div className="applications-list">
            {applications.map((app) => (
           <div key={app._id} className="application-card">
    
          <div className="app-header">
      <h3>{app.company || app.internshipId?.company || 'Application'}</h3>

      <span className={`status-badge ${getStatusColor(app.status)}`}>
        {getStatusIcon(app.status)} {app.status}
      </span>
    </div>

    <div className="app-content">

      <div className="info-row">
        <span className="label">USN:</span>
        <span className="value">{app.usn}</span>
      </div>

      <div className="info-row">
        <span className="label">Applied Date:</span>
        <span className="value">
          {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'Not available'}
        </span>
      </div>

    </div>
  </div>
))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationStatus;
