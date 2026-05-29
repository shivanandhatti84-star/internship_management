import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/Dashboard.css';

function StudentEvaluationResults({ user }) {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvaluations = async () => {
      try {
        const res = await fetch(`http://localhost:5000/mentor/evaluation/${user.usn}`);
        if (!res.ok) throw new Error('Failed to load evaluations');
        const data = await res.json();
        const evaluationsData = Array.isArray(data) ? data : [];
        setEvaluations(evaluationsData);
      } catch (err) {
        console.error(err);
        setError('Unable to load evaluation results.');
      } finally {
        setLoading(false);
      }
    };
    if (user?.usn) loadEvaluations();
  }, [user]);

  const safeBadgeClass = (value) => String(value || 'pending').toLowerCase();
  const hasResults = evaluations.some(ev =>
    ev.technicalSkills || ev.attendance || ev.overallGrade || ev.mentorRemarks || ev.recommendation
  );

  return (
    <div className="page">
      <Header showNav={true} />
      <div className="dashboard-container">
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2>Evaluation Results</h2>
              <p className="dashboard-subtitle">Review your mentor’s evaluation feedback and schedule details.</p>
            </div>
            <button className="dashboard-btn" style={{ minWidth: 160 }} onClick={() => navigate('/student/dashboard')}>
              ← Back to Dashboard
            </button>
          </div>

          {loading ? (
            <p>Loading evaluation results...</p>
          ) : error ? (
            <p>{error}</p>
          ) : evaluations.length === 0 ? (
            <div className="empty-state">
              <p>No evaluations have been assigned yet.</p>
            </div>
          ) : (
            <div className="evaluation-results-list">
              {evaluations.map((ev) => (
                <div key={`${ev.usn}-${ev.evaluationNumber}`} className="evaluation-result-card">
                  <div className="result-card-header">
                    <div>
                      <h3>Evaluation {ev.evaluationNumber}</h3>
                      <p className="schedule-status-msg">
                        Scheduled for: <strong>{ev.scheduledAt ? new Date(ev.scheduledAt).toLocaleString('en-IN') : 'Not scheduled'}</strong>
                      </p>
                    </div>
                    <span className="phase-grade-pill">Grade: {ev.overallGrade || 'Pending'}</span>
                  </div>

                  <div className="criteria-grid">
                    <div className="criteria-item">
                      <span className="criteria-label">Technical Skills</span>
                      <span className={`rating-badge badge-${safeBadgeClass(ev.technicalSkills)}`}>{ev.technicalSkills || 'Pending'}</span>
                    </div>
                    <div className="criteria-item">
                      <span className="criteria-label">Communication</span>
                      <span className={`rating-badge badge-${safeBadgeClass(ev.communication)}`}>{ev.communication || 'Pending'}</span>
                    </div>
                    <div className="criteria-item">
                      <span className="criteria-label">Teamwork</span>
                      <span className={`rating-badge badge-${safeBadgeClass(ev.teamwork)}`}>{ev.teamwork || 'Pending'}</span>
                    </div>
                    <div className="criteria-item">
                      <span className="criteria-label">Punctuality</span>
                      <span className={`rating-badge badge-${safeBadgeClass(ev.punctuality)}`}>{ev.punctuality || 'Pending'}</span>
                    </div>
                    <div className="criteria-item">
                      <span className="criteria-label">Project Quality</span>
                      <span className={`rating-badge badge-${safeBadgeClass(ev.projectQuality)}`}>{ev.projectQuality || 'Pending'}</span>
                    </div>
                    <div className="criteria-item">
                      <span className="criteria-label">Innovation</span>
                      <span className={`rating-badge badge-${safeBadgeClass(ev.innovation)}`}>{ev.innovation || 'Pending'}</span>
                    </div>
                    <div className="criteria-item">
                      <span className="criteria-label">Problem Solving</span>
                      <span className={`rating-badge badge-${safeBadgeClass(ev.problemSolving)}`}>{ev.problemSolving || 'Pending'}</span>
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
                      <span className="detail-label">Recommendation</span>
                      <p className="detail-value">{ev.recommendation}</p>
                    </div>
                  )}

                  {!hasResults && (
                    <div className="empty-state">
                      <p>Evaluation has been scheduled. Your mentor will fill the result after the session.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentEvaluationResults;
