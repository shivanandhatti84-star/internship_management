import React, { useEffect, useState, createContext, useContext } from 'react';
import '../styles/Header.css';

export const PortalHeaderContext = createContext(false);

function Header({ showNav = false, onLogout, isPortalHeader = false }) {
  const [currentUser, setCurrentUser] = useState(null);
  const isInsidePortal = useContext(PortalHeaderContext);

  useEffect(() => {
    if (showNav) {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [showNav]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  if (isInsidePortal && !isPortalHeader) {
    return null;
  }

  return (
    <header className="header">
      <div className="header-left">
        <img 
          src="https://learn.kletech.ac.in/theme/image.php/university/theme_university/1712427483/logo" 
          alt="KLE Tech Logo"
          className="header-logo"
        />
        <div className="header-text-container">
          <h1 className="header-univ-title">KLE Technological University</h1>
          <p className="header-univ-subtitle">Hubballi, Karnataka, India</p>
          <p className="header-portal-title">Internship Management System</p>
        </div>
      </div>
      {showNav && (
        <div className="header-right">
          {currentUser && (
            <div className="header-user-badge">
              <span className="user-icon">👤</span>
              <span className="user-text">
                {currentUser.role === 'student' ? currentUser.usn : currentUser.name} ({currentUser.role.toUpperCase()})
              </span>
            </div>
          )}
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;