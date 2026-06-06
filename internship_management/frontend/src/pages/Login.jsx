import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Auth.css';
import API from '../api';

function Login({ onLogin }) {
  const [usn, setUsn]           = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!role) { setError('Please select a role'); setLoading(false); return; }

    try {
      const payload = role === 'student'
        ? { usn, role, password }
        : { name: usn, role, password };

      const res  = await fetch(`${API}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.text();

      if (data.trim() === 'User not found') {
        setError('User not found. Please register first.');
      } else if (data.trim() === 'Wrong password') {
        setError('Incorrect password. Please try again.');
      } else if (data.trim() === 'Login success') {
        if (role === 'student') {
          onLogin({ usn, role });
        } else {
          onLogin({ name: usn, role });
        }
        navigate(`/${role}/dashboard`);
      } else {
        setError('Login failed. Please try again.');
      }
    } catch {
      setError('Backend not reachable. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <div className="portal-body">
        <div className="portal-content-grid">
          <div className="portal-left-column">
            <div className="portal-card welcome-card">
              <h3 className="portal-card-title">Welcome to KLETECH</h3>
              <div className="welcome-banner-img"></div>
              <p className="welcome-text">
                KLE Technological University (KLE Tech) has its roots in B. V. Bhoomaraddi College of Engineering and Technology, Hubli (BVB), one of the premier engineering institutions of Karnataka. The founding organization KLE Society, Belgaum, established BVB college in 1947 with an aspiration of creating an institution that would lay the foundation of modern engineering education in northern region of Karnataka.
              </p>
              <div className="portal-links">
                <span className="click-label">Click here to access:</span>
                <div className="link-buttons-container">
                  <a href="https://parents.kletech.ac.in/kletechparentodd/" target="_blank" rel="noopener noreferrer" className="portal-link-btn">Odd 2025 parent portal</a>
                </div>
              </div>
            </div>

            <div className="portal-card notice-card">
              <h3 className="portal-card-title">Notice Board</h3>
              <div className="notice-board-content">
                <ul className="notice-list">
                  <li className="notice-item">
                    <span className="notice-date">June 06, 2026</span>
                    <p className="notice-desc">Welcome to the digital Internship Management Portal of KLE Technological University. Students can now monitor and track their internships online.</p>
                  </li>
                  <li className="notice-item">
                    <span className="notice-date">June 02, 2026</span>
                    <p className="notice-desc"><strong>Dear Students,</strong> please update your profiles and upload your latest resume by June 12, 2026, to allow coordinators to assign mentors.</p>
                  </li>
                  <li className="notice-item">
                    <span className="notice-date">May 28, 2026</span>
                    <p className="notice-desc">Evaluation schedules for Phase-I will be announced soon. Please keep in contact with your assigned academic mentors.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="portal-right-column">
            <div className="portal-card login-card">
              <h3 className="portal-card-title login-title">Login - Even Term 2026</h3>
              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="portal-label">Select Role</label>
                  <select className="portal-select-input" value={role} onChange={e => setRole(e.target.value)} required>
                    <option value="">-- Select Role --</option>
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                    <option value="hod">HOD</option>
                    <option value="coordinator">Coordinator</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="portal-label">{role === 'student' || role === '' ? 'USN' : 'Name'}</label>
                  <input
                    type="text"
                    className="portal-text-input"
                    placeholder={role === 'student' || role === '' ? 'Enter your USN' : 'Enter your Name'}
                    value={usn}
                    onChange={e => setUsn(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="portal-label">Password</label>
                  <input
                    type="password"
                    className="portal-text-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-submit-portal" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <p className="auth-switch-portal">
                Don't have an account?{' '}
                <a href="/register" className="link-portal">Register here</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="portal-footer">
        <p className="footer-contineo">Copyright © Powered By <a href="http://www.contineo.in/" target="_blank" rel="noopener noreferrer">Contineo</a></p>
        <p className="footer-policies">
          <a href="#tos" className="footer-link">Terms of Service</a> | <a href="#privacy" className="footer-link">Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
}

export default Login;
