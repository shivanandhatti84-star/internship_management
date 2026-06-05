/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import '../../styles/Profile.css';

/**
 * ProfileSetupGuard
 * -----------------
 * Wrap all student routes with this component.
 * If the student's profile is incomplete (name / email / phone / cgpa missing),
 * it renders the mandatory profile-setup form INSTEAD of the actual page.
 *
 * Usage in your router:
 *   <Route path="/student/*" element={
 *     <ProfileSetupGuard user={user}>
 *       <StudentRoutes />
 *     </ProfileSetupGuard>
 *   } />
 */

const REQUIRED_FIELDS = ['name', 'email', 'phone', 'cgpa', 'branch'];

function isProfileComplete(profile) {
  if (!profile) return false;
  return REQUIRED_FIELDS.every(f => profile[f] && String(profile[f]).trim() !== '');
}

function ProfileSetupGuard({ user, children }) {
  const [profile, setProfile]         = useState(null);
  const [checking, setChecking]       = useState(true);
  const [formData, setFormData]       = useState({
    name: '', email: '', phone: '', cgpa: '', branch: 'CSE',
  });
  const [saving, setSaving]           = useState(false);
  const [errors, setErrors]           = useState({});

  useEffect(() => {
    checkProfile();
  }, [user?.usn]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkProfile = async () => {
    if (!user?.usn) { setChecking(false); return; }
    try {
      const res  = await fetch(`https://internship-management-uhf3.onrender.com/profile/${user.usn}`);
      const data = await res.json();
      setProfile(data);
      // Pre-fill form with whatever exists
      setFormData({
        name:   data?.name   || '',
        email:  data?.email  || '',
        phone:  data?.phone  || '',
        cgpa:   data?.cgpa   || '',
        branch: data?.branch || 'CSE',
      });
    } catch {
      setProfile(null);
    }
    setChecking(false);
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim())  e.name  = 'Name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Enter a valid email';
    if (!formData.phone.trim()) e.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone.trim())) e.phone = 'Enter a valid 10-digit phone number';
    if (!formData.cgpa) e.cgpa = 'CGPA is required';
    else if (isNaN(formData.cgpa) || formData.cgpa < 0 || formData.cgpa > 10)
      e.cgpa = 'CGPA must be between 0 and 10';
    return e;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('https://internship-management-uhf3.onrender.com/profile/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, usn: user?.usn }),
      });

      const msg = await res.text();

      // Re-check profile after save
      await checkProfile();
      alert(msg || 'Profile saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save profile. Please try again.');
    }
    setSaving(false);
  };

  // ---- Still loading ----
  if (checking) {
    return (
      <div className="page">
        <Header showNav={false} />
        <div className="profile-container">
          <div className="loading">Checking profile...</div>
        </div>
      </div>
    );
  }

  // ---- Profile complete — render children normally ----
  if (isProfileComplete(profile)) {
    return children;
  }

  // ---- Profile incomplete — show mandatory setup screen ----
  return (
    <div className="page">
      <Header showNav={false} />

      <div className="profile-container">
        <div className="profile-setup-banner">
          <span className="setup-icon">⚠️</span>
          <div>
            <strong>Complete Your Profile to Continue</strong>
            <p>Please fill in all required details before accessing the portal.</p>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">
              {(formData.name || user?.usn || 'S').charAt(0).toUpperCase()}
            </div>
            <h3>Welcome, {user?.usn}!</h3>
            <p style={{ color: '#888', fontSize: '0.85rem', marginTop: 4 }}>
              First-time setup — all fields are required
            </p>
          </div>

          <div className="profile-content">
            <form className="profile-form" onSubmit={(e) => e.preventDefault()}>

              <div className="form-group">
                <label>Full Name <span className="required-star">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Ravi Kumar"
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email <span className="required-star">*</span></label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. ravi@college.edu"
                  className={errors.email ? 'input-error' : ''}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Phone <span className="required-star">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  className={errors.phone ? 'input-error' : ''}
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label>CGPA <span className="required-star">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  placeholder="e.g. 8.5"
                  className={errors.cgpa ? 'input-error' : ''}
                />
                {errors.cgpa && <span className="field-error">{errors.cgpa}</span>}
              </div>

              <div className="form-group">
                <label>Branch <span className="required-star">*</span></label>
                <select name="branch" value={formData.branch} onChange={handleInputChange}>
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
                  disabled={saving}
                >
                  {saving ? 'Saving...' : '✓ Save & Continue'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetupGuard;
