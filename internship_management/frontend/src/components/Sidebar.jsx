import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (!user) return null;

  const role = user.role;

  const menuItems = {
    student: [
      { path: '/student/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/student/internships', label: 'View Internships', icon: '📋' },
      { path: '/student/status', label: 'Application Status', icon: '📊' },
      { path: '/student/profile', label: 'My Profile', icon: '👤' },
      { path: '/student/evaluation-results', label: 'Evaluation Results', icon: '📘' }
    ],
    coordinator: [
      { path: '/coordinator/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/coordinator/add-internship', label: 'Add Internship', icon: '➕' },
      { path: '/coordinator/monitor', label: 'Monitor Applications', icon: '📊' },
      { path: '/coordinator/assign-mentor', label: 'Assign Mentor', icon: '👨‍🏫' }
    ],
    mentor: [
      { path: '/mentor/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/mentor/evaluation', label: 'Evaluation Reports', icon: '📝' },
      { path: '/mentor/progress', label: 'Student Progress', icon: '📈' },
      { path: '/mentor/student-profiles', label: 'Student Profiles', icon: '👥' }
    ],
    hod: [
      { path: '/hod/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/hod/mentor-details', label: 'Mentor Details', icon: '👥' },
      { path: '/hod/department-stats', label: 'Department Stats', icon: '📊' }
    ]
  };

  const items = menuItems[role] || [];

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <div className="sidebar-avatar">
          {role === 'student' ? '🎓' : '💼'}
        </div>
        <div className="sidebar-profile-info">
          <h4 className="sidebar-username">
            {role === 'student' ? user.usn : user.name}
          </h4>
          <span className="sidebar-role-badge">{role.toUpperCase()}</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
