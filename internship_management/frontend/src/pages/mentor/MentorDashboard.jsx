import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/Dashboard.css';

function MentorDashboard({ onLogout, user }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(`https://internship-management-uhf3.onrender.com/auth/user/${user.usn}`);
        if (!res.ok) return;
        const data = await res.json();
        setProfile(data);
        if (!data.name || data.name.trim() === '') setShowModal(true);
      } catch (err) {
        console.error('Could not load profile', err);
      }
    };
    if (user?.usn) loadProfile();
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.target);
    const payload = {
      name: form.get('name'),
      department: form.get('department'),
      phone: form.get('phone')
    };
    try {
      const res = await fetch(`https://internship-management-uhf3.onrender.com/auth/user/${user.usn}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      if (text === 'Profile updated') {
        setShowModal(false);
        setProfile(prev => ({ ...(prev||{}), ...payload }));
        alert('Profile saved');
      } else alert(text);
    } catch (err) { console.error(err); alert('Failed to save profile'); }
    setSaving(false);
  };

  return (
    <div className="dashboard-page">
      <Header showNav={true} onLogout={() => { onLogout(); navigate('/login'); }} />
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h2>Mentor Dashboard</h2>
          <p className="dashboard-subtitle">Welcome, {profile?.name || user?.usn}!</p>
          <div className="dashboard-buttons">
            <button className="dashboard-btn" onClick={() => navigate('/mentor/evaluation')}>
              <span className="btn-icon">📝</span> Evaluation Reports
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

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Complete your profile</h3>
            <p>Please provide your full name and department — only asked once.</p>
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label>Full Name</label>
                <input name="name" defaultValue={profile?.name || ''} required />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input name="department" defaultValue={profile?.department || ''} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" defaultValue={profile?.phone || ''} />
              </div>
              <div style={{ marginTop: 12 }}>
                <button type="submit" className="btn-add" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MentorDashboard;
