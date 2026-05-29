// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../../components/Header';
// import '../../styles/Dashboard.css';

// function CoordinatorDashboard({ onLogout, user }) {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     onLogout();
//     navigate('/login');
//   };

//   return (
//     <div className="dashboard-page">
//       <Header showNav={true} onLogout={handleLogout} />
      
//       <div className="dashboard-container">
//         <div className="dashboard-card">
//           <h2>Coordinator Dashboard</h2>
//           <p className="dashboard-subtitle">Manage internships and monitor applications</p>
          
//           <div className="dashboard-buttons">
//             <button 
//               className="dashboard-btn"
//               onClick={() => navigate('/coordinator/add-internship')}
//             >
//               <span className="btn-icon">➕</span>
//               Add Internship
//             </button>
            
//             <button 
//               className="dashboard-btn"
//               onClick={() => navigate('/coordinator/monitor')}
//             >
//               <span className="btn-icon">📊</span>
//               Monitor Applications
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CoordinatorDashboard;




// ===========================
// CoordinatorDashboard.jsx
// ===========================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/Dashboard.css';

function CoordinatorDashboard({ onLogout, user }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="dashboard-page">

      <Header
        showNav={true}
        onLogout={handleLogout}
      />

      <div className="dashboard-container">

        <div className="dashboard-card">

          <h2>Coordinator Dashboard</h2>

          <p className="dashboard-subtitle">
            Manage internships and monitor applications
          </p>

          <div className="dashboard-buttons">

            {/* ADD INTERNSHIP */}
            <button
              className="dashboard-btn"
              onClick={() =>
                navigate('/coordinator/add-internship')
              }
            >
              <span className="btn-icon">➕</span>
              Add Internship
            </button>

            {/* MONITOR APPLICATIONS */}
            <button
              className="dashboard-btn"
              onClick={() =>
                navigate('/coordinator/monitor')
              }
            >
              <span className="btn-icon">📊</span>
              Monitor Applications
            </button>

            {/* ASSIGN MENTOR */}
            <button
              className="dashboard-btn"
              onClick={() =>
                navigate('/coordinator/assign-mentor')
              }
            >
              <span className="btn-icon">👨‍🏫</span>
              Assign Mentor
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CoordinatorDashboard;