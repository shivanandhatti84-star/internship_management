import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Auth.css';

function Register() {
  const [usn, setUsn] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const pattern = /^[a-zA-Z0-9@#$%^&*()._+-]{6,}$/;
    return pattern.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!role) {
      setError('Please select a role');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters with letters, numbers, and special characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usn, email, role, password }),
      });

      const data = await res.text();

      if (data.trim() === 'Registered successfully') {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Backend not reachable. Please try again later.');
      console.error('Register Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <div className="auth-container">
        <div className="auth-card">
          <h2>Register</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">-- Select Role --</option>
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
                <option value="hod">HOD</option>
                <option value="coordinator">Coordinator</option>
              </select>
            </div>

            <div className="form-group">
              <label>USN</label>
              <input
                type="text"
                placeholder="Enter your USN"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter password (min 6 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <a href="/login" className="link">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;