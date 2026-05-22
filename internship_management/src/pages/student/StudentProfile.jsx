import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/Profile.css';

function StudentProfile({ user }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  // ================= LOAD PROFILE FROM DATABASE =================
  const loadProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/profile/${user.usn}`);
      const data = await res.json();

      const userProfile = data || {
        usn: user?.usn,
        name: '',
        email: '',
        phone: '',
        cgpa: '',
        branch: 'CSE',
      };

      setProfile(userProfile);
      setFormData(userProfile);
    } catch (error) {
      console.error(error);

      const userProfile = {
        usn: user?.usn,
        name: '',
        email: '',
        phone: '',
        cgpa: '',
        branch: 'CSE',
      };

      setProfile(userProfile);
      setFormData(userProfile);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ================= SAVE PROFILE TO DATABASE =================
  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:5000/profile/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.text();

      alert(data);

      setProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert('Failed to save profile');
    }
  };

  return (
    <div className="page">
      <Header showNav={true} />

      <div className="profile-container">
        <div className="page-header">
          <h2>My Profile</h2>

          <button
            className="btn-back"
            onClick={() => navigate('/student/dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>

        {profile ? (
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar">
                {(profile.name || 'S').charAt(0).toUpperCase()}
              </div>

              <h3>{profile.name || 'Student'}</h3>
            </div>

            <div className="profile-content">
              {isEditing ? (
                <form className="profile-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      name="cgpa"
                      value={formData.cgpa}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Branch</label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                    >
                      <option value="CSE">Computer Science Engineering</option>
                      <option value="ECE">Electronics & Communication</option>
                      <option value="ME">Mechanical Engineering</option>
                      <option value="CE">Civil Engineering</option>
                    </select>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn-save"
                      onClick={handleSave}
                    >
                      Save Changes
                    </button>

                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(profile);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="profile-info">
                    <div className="info-row">
                      <span className="label">USN:</span>
                      <span className="value">{profile.usn}</span>
                    </div>

                    <div className="info-row">
                      <span className="label">Name:</span>
                      <span className="value">
                        {profile.name || 'Not provided'}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="label">Email:</span>
                      <span className="value">
                        {profile.email || 'Not provided'}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="label">Phone:</span>
                      <span className="value">
                        {profile.phone || 'Not provided'}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="label">CGPA:</span>
                      <span className="value">
                        {profile.cgpa || 'Not provided'}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="label">Branch:</span>
                      <span className="value">{profile.branch}</span>
                    </div>
                  </div>

                  <button
                    className="btn-edit"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="loading">Loading profile...</div>
        )}
      </div>
    </div>
  );
}

export default StudentProfile;