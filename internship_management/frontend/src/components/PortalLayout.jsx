import React from 'react';
import Header, { PortalHeaderContext } from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import '../styles/PortalLayout.css';

function PortalLayout({ children, onLogout }) {
  return (
    <div className="portal-layout-wrapper">
      <Header isPortalHeader={true} showNav={true} onLogout={onLogout} />
      <div className="portal-layout-main">
        <Sidebar />
        <main className="portal-layout-content">
          <PortalHeaderContext.Provider value={true}>
            {children || <Outlet />}
          </PortalHeaderContext.Provider>
        </main>
      </div>
    </div>
  );
}

export default PortalLayout;
