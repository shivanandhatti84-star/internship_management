import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/Profile.css';
import API from '../../api';

function StudentProfile({ user }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch(`${API}/profile/${user.usn}`);
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
  }, [user?.usn]);

  useEffect(() => {
    loadProfile();
    if (location?.state?.openUpload) {
      setTimeout(() => {
        fileInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        fileInputRef.current?.focus?.();
      }, 400);
    }
  }, [loadProfile, location?.state?.openUpload]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`${API}/profile/save`, {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file || null);
  };

  const handleUpload = async () => {
    if (!resumeFile) return alert('Please select a file (PDF or PPT).');
    if (!profile?.usn) return alert('Profile not loaded. Please refresh the page.');
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append('resume', resumeFile);
      fd.append('usn', profile.usn);

      const res = await fetch(`${API}/profile/upload`, {
        method: 'POST',
        body: fd,
      });

      const text = await res.text();
      alert(text);
      setResumeFile(null);
      loadProfile();
    } catch (err) {
      console.error(err);
      alert('Failed to upload resume');
    }
    setIsUploading(false);
  };

  return (
    <div className="page">
      <Header showNav={true} />
      <div className="profile-container">
        <div className="page-header">
          <h2>My Profile</h2>
          <button className="btn-back" onClick={() => navigate('/student/dashboard')}>
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
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>CGPA</label>
                    <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Branch</label>
                    <select name="branch" value={formData.branch} onChange={handleInputChange}>
                      <option value="CSE">Computer Science Engineering</option>
                      <option value="ECE">Electronics & Communication</option>
                      <option value="ME">Mechanical Engineering</option>
                      <option value="CE">Civil Engineering</option>
                    </select>
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn-save" onClick={handleSave}>Save Changes</button>
                    <button type="button" className="btn-cancel" onClick={() => { setIsEditing(false); setFormData(profile); }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="profile-info">
                    <div className="info-row"><span className="label">USN:</span><span className="value">{profile.usn}</span></div>
                    <div className="info-row"><span className="label">Name:</span><span className="value">{profile.name || 'Not provided'}</span></div>
                    <div className="info-row"><span className="label">Email:</span><span className="value">{profile.email || 'Not provided'}</span></div>
                    <div className="info-row"><span className="label">Phone:</span><span className="value">{profile.phone || 'Not provided'}</span></div>
                    <div className="info-row"><span className="label">CGPA:</span><span className="value">{profile.cgpa || 'Not provided'}</span></div>
                    <div className="info-row"><span className="label">Branch:</span><span className="value">{profile.branch}</span></div>
                  </div>

                  <div className="resume-section">
                    <label className="label">Resume</label>
                    {profile.resume && profile.resume.filename ? (
                      <div className="resume-info">
                        <a href={`${API}${profile.resume.path}`} target="_blank" rel="noreferrer">
                          View / Download Resume
                        </a>
                      </div>
                    ) : (
                      <div className="resume-info">No resume uploaded.</div>
                    )}

                    <div className="resume-upload">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.ppt,.pptx"
                        onChange={handleFileChange}
                      />
                      <button
                        type="button"
                        className="btn-upload"
                        onClick={handleUpload}
                        disabled={isUploading || !resumeFile}
                      >
                        {isUploading ? 'Uploading...' : resumeFile ? `Upload "${resumeFile.name}"` : 'Upload Resume'}
                      </button>
                    </div>
                  </div>

                  <button type="button" className="btn-edit" onClick={() => setIsEditing(true)}>
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
