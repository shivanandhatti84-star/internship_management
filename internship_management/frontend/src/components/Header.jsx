import React from 'react';
import '../styles/Header.css';

function Header({ showNav = false, onLogout }) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="header">
      <img 
        src="https://learn.kletech.ac.in/theme/image.php/university/theme_university/1712427483/logo" 
        alt="Logo"
        className="header-logo"
      />
      <h1 className="header-title">Internship Management System</h1>
      {showNav && (
        <div className="header-nav">
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;