// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../components/Header';
// import '../styles/Auth.css';

// function Login({ onLogin }) {
//   const [usn, setUsn] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     if (!role) {
//       setError('Please select a role');
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch('http://localhost:5000/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ usn, role, password }),
//       });

//       const data = await res.text();

//       if (data.trim() === 'User not found') {
//         setError('User not found. Please register first.');
//       } else if (data.trim() === 'Wrong password') {
//         setError('Password is incorrect.');
//       } else if (data.trim() === 'Login success') {
//         const user = { usn, role };
//         onLogin(user);
//         navigate(`/${role}/dashboard`);
//       } else {
//         setError('Login failed. Please try again.');
//       }
//     } catch (err) {
//       setError('Backend not reachable. Please try again later.');
//       console.error('Login Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <Header />
//       <div className="auth-container">
//         <div className="auth-card">
//           <h2>Login</h2>
//           {error && <div className="error-message">{error}</div>}
          
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Select Role</label>
//               <select
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 required
//               >
//                 <option value="">-- Select Role --</option>
//                 <option value="student">Student</option>
//                 <option value="mentor">Mentor</option>
//                 <option value="hod">HOD</option>
//                 <option value="coordinator">Coordinator</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>USN</label>
//               <input
//                 type="text"
//                 placeholder="Enter your USN"
//                 value={usn}
//                 onChange={(e) => setUsn(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label>Password</label>
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>

//             <button type="submit" className="btn-submit" disabled={loading}>
//               {loading ? 'Logging in...' : 'Login'}
//             </button>
//           </form>

//           <p className="auth-switch">
//             Don't have an account?{' '}
//             <a href="/register" className="link">Register here</a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/Auth.css';

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
      const res  = await fetch('https://internship-management-uhf3.onrender.com/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ usn, role, password }),
      });
      const data = await res.text();

      if (data.trim() === 'User not found') {
        setError('User not found. Please register first.');
      } else if (data.trim() === 'Wrong password') {
        setError('Incorrect password. Please try again.');
      } else if (data.trim() === 'Login success') {
        onLogin({ usn, role });
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
      <div className="auth-container">
        <div className="auth-card">
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} required>
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
                onChange={e => setUsn(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <a href="/register" className="link">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
