// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../../components/Header';
// import '../../styles/Monitor.css';

// function MonitorApplications({ user }) {
//   const [applications, setApplications] = useState([]);
//   const [filterStatus, setFilterStatus] = useState('All');
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadApplications();
//   }, []);

//   // ================= LOAD FROM DATABASE =================
//   const loadApplications = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/applications');
//       const data = await res.json();
//       setApplications(data);
//     } catch (error) {
//       console.error(error);
//       alert('Failed to load applications');
//     }
//   };

//   const filteredApplications =
//     filterStatus === 'All'
//       ? applications
//       : applications.filter(app => app.status === filterStatus);

//   // ================= ACCEPT / REJECT =================
//   const handleStatusChange = async (appId, newStatus) => {
//     const app = applications.find(a => a._id === appId);

//     if (app.status !== 'Pending') {
//       alert(`This application has already been ${app.status}.`);
//       return;
//     }

//     const confirmed = window.confirm(
//       `Are you sure you want to ${newStatus} ${app.usn}'s application?\nThis cannot be changed later.`
//     );

//     if (!confirmed) return;

//     try {
//       const res = await fetch(
//         `http://localhost:5000/applications/${appId}`,
//         {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ status: newStatus }),
//         }
//       );

//       const data = await res.text();
//       alert(data);

//       loadApplications();
//     } catch (error) {
//       console.error(error);
//       alert('Failed to update status');
//     }
//   };

//   // ================= DELETE =================
//   const handleDeleteApplication = async (appId) => {
//     const confirmDelete = window.confirm(
//       'Are you sure you want to delete this application?'
//     );

//     if (!confirmDelete) return;

//     try {
//       const res = await fetch(
//         `http://localhost:5000/applications/${appId}`,
//         {
//           method: 'DELETE',
//         }
//       );

//       const data = await res.text();
//       alert(data);

//       loadApplications();
//     } catch (error) {
//       console.error(error);
//       alert('Failed to delete');
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Accepted':
//         return 'status-accepted';
//       case 'Rejected':
//         return 'status-rejected';
//       case 'Pending':
//         return 'status-pending';
//       default:
//         return '';
//     }
//   };

//   const stats = {
//     total: applications.length,
//     pending: applications.filter(a => a.status === 'Pending').length,
//     accepted: applications.filter(a => a.status === 'Accepted').length,
//     rejected: applications.filter(a => a.status === 'Rejected').length,
//   };

//   return (
//     <div className="page">
//       <Header showNav={true} />

//       <div className="monitor-container">
//         <div className="page-header">
//           <h2>Monitor Applications</h2>

//           <button
//             className="btn-back"
//             onClick={() => navigate('/coordinator/dashboard')}
//           >
//             Back to Dashboard
//           </button>
//         </div>

//         {/* Stats */}
//         <div className="stats-grid">
//           <div className="stat-card">
//             <span className="stat-number">{stats.total}</span>
//             <span className="stat-label">Total</span>
//           </div>

//           <div className="stat-card pending">
//             <span className="stat-number">{stats.pending}</span>
//             <span className="stat-label">Pending</span>
//           </div>

//           <div className="stat-card accepted">
//             <span className="stat-number">{stats.accepted}</span>
//             <span className="stat-label">Accepted</span>
//           </div>

//           <div className="stat-card rejected">
//             <span className="stat-number">{stats.rejected}</span>
//             <span className="stat-label">Rejected</span>
//           </div>
//         </div>

//         {/* Filter */}
//         <div className="filter-section">
//           <label>Filter by Status:</label>

//           <div className="filter-buttons">
//             {['All', 'Pending', 'Accepted', 'Rejected'].map(status => (
//               <button
//                 key={status}
//                 className={`filter-btn ${
//                   filterStatus === status ? 'active' : ''
//                 }`}
//                 onClick={() => setFilterStatus(status)}
//               >
//                 {status}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Table */}
//         {filteredApplications.length === 0 ? (
//           <div className="empty-state">
//             <p>No applications found.</p>
//           </div>
//         ) : (
//           <div className="applications-table-container">
//             <table className="applications-table">
//               <thead>
//                 <tr>
//                   <th>USN</th>
//                   <th>Company</th>
//                   <th>Role</th>
//                   <th>Applied Date</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredApplications.map((app) => {
//                   const isDecided = app.status !== 'Pending';

//                   return (
//                     <tr key={app._id}>
//                       <td>{app.usn}</td>
//                       <td>{app.company}</td>
//                       <td>{app.role}</td>
//                       <td>
//                         {new Date(app.createdAt).toLocaleDateString()}
//                       </td>

//                       <td>
//                         {isDecided ? (
//                           <span
//                             className={`status-badge-fixed ${getStatusColor(
//                               app.status
//                             )}`}
//                           >
//                             {app.status}
//                           </span>
//                         ) : (
//                           <div className="action-buttons">
//                             <button
//                               className="btn-accept"
//                               onClick={() =>
//                                 handleStatusChange(
//                                   app._id,
//                                   'Accepted'
//                                 )
//                               }
//                             >
//                               ✓ Accept
//                             </button>

//                             <button
//                               className="btn-reject"
//                               onClick={() =>
//                                 handleStatusChange(
//                                   app._id,
//                                   'Rejected'
//                                 )
//                               }
//                             >
//                               ✗ Reject
//                             </button>
//                           </div>
//                         )}
//                       </td>

//                       <td>
//                         <button
//                           className="btn-delete-small"
//                           onClick={() =>
//                             handleDeleteApplication(app._id)
//                           }
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default MonitorApplications;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/Monitor.css';

function MonitorApplications({ user }) {
  const [applications, setApplications]     = useState([]);
  const [filterStatus, setFilterStatus]     = useState('All');
  const [selectedApp, setSelectedApp]       = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { loadApplications(); }, []);

  const loadApplications = async () => {
    try {
      const res  = await fetch('http://localhost:5000/applications');
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load applications');
    }
  };

  const loadStudentProfile = async (usn) => {
    setProfileLoading(true);
    setStudentProfile(null);
    try {
      const res  = await fetch(`http://localhost:5000/profile/${usn}`);
      const data = await res.json();
      setStudentProfile(data);
    } catch (err) {
      console.error(err);
    }
    setProfileLoading(false);
  };

  const handleViewProfile = (app) => {
    setSelectedApp(app);
    loadStudentProfile(app.usn);
  };

  const handleCloseDrawer = () => {
    setSelectedApp(null);
    setStudentProfile(null);
  };

  const filteredApplications =
    filterStatus === 'All'
      ? applications
      : applications.filter(app => app.status === filterStatus);

  const handleStatusChange = async (appId, newStatus) => {
    const app = applications.find(a => a._id === appId);
    if (app.status !== 'Pending') {
      alert(`This application has already been ${app.status}.`);
      return;
    }
    if (!window.confirm(
      `Are you sure you want to ${newStatus} ${app.usn}'s application?\nThis cannot be changed later.`
    )) return;

    try {
      const res = await fetch(`http://localhost:5000/applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const msg = await res.text();
      alert(msg);
      loadApplications();
      if (selectedApp?._id === appId)
        setSelectedApp(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  const handleDeleteApplication = async (appId) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      const res = await fetch(`http://localhost:5000/applications/${appId}`, { method: 'DELETE' });
      const msg = await res.text();
      alert(msg);
      loadApplications();
      if (selectedApp?._id === appId) handleCloseDrawer();
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  const statusClass = (s) =>
    s === 'Accepted' ? 'badge-accepted' : s === 'Rejected' ? 'badge-rejected' : 'badge-pending';

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });

  const branchFull = (b) =>
    ({ CSE: 'Computer Science Engg.', ECE: 'Electronics & Comm.', ME: 'Mechanical Engg.', CE: 'Civil Engg.' }[b] || b);

  const stats = {
    total:    applications.length,
    pending:  applications.filter(a => a.status === 'Pending').length,
    accepted: applications.filter(a => a.status === 'Accepted').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  };

  return (
    <div className="page">
      <Header showNav={true} />

      <div className={`monitor-layout ${selectedApp ? 'drawer-open' : ''}`}>

        {/* ============ LEFT: main content ============ */}
        <div className="monitor-main">
          <div className="page-header">
            <h2>Monitor Applications</h2>
            <button className="btn-back" onClick={() => navigate('/coordinator/dashboard')}>
              Back to Dashboard
            </button>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-card pending">
              <span className="stat-number">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card accepted">
              <span className="stat-number">{stats.accepted}</span>
              <span className="stat-label">Accepted</span>
            </div>
            <div className="stat-card rejected">
              <span className="stat-number">{stats.rejected}</span>
              <span className="stat-label">Rejected</span>
            </div>
          </div>

          {/* Filter */}
          <div className="filter-section">
            <label>Filter by Status:</label>
            <div className="filter-buttons">
              {['All', 'Pending', 'Accepted', 'Rejected'].map(s => (
                <button
                  key={s}
                  className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
                  onClick={() => setFilterStatus(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {filteredApplications.length === 0 ? (
            <div className="empty-state"><p>No applications found.</p></div>
          ) : (
            <div className="applications-table-container">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>USN</th>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Applied Date</th>
                    <th>Status / Action</th>
                    <th>Profile</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map(app => (
                    <tr
                      key={app._id}
                      className={selectedApp?._id === app._id ? 'row-selected' : ''}
                    >
                      <td className="td-usn">{app.usn}</td>
                      <td>{app.company}</td>
                      <td>{app.role}</td>
                      <td>{formatDate(app.createdAt)}</td>
                      <td>
                        {app.status !== 'Pending' ? (
                          <span className={`status-badge ${statusClass(app.status)}`}>
                            {app.status}
                          </span>
                        ) : (
                          <div className="action-buttons">
                            <button className="btn-accept" onClick={() => handleStatusChange(app._id, 'Accepted')}>
                              ✓ Accept
                            </button>
                            <button className="btn-reject" onClick={() => handleStatusChange(app._id, 'Rejected')}>
                              ✗ Reject
                            </button>
                          </div>
                        )}
                      </td>
                      <td>
                        <button
                          className={`btn-view-profile ${selectedApp?._id === app._id ? 'active' : ''}`}
                          onClick={() =>
                            selectedApp?._id === app._id
                              ? handleCloseDrawer()
                              : handleViewProfile(app)
                          }
                        >
                          {selectedApp?._id === app._id ? 'Close' : '👤 View'}
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn-delete-small"
                          onClick={() => handleDeleteApplication(app._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ============ RIGHT: inline profile drawer ============ */}
        {selectedApp && (
          <div className="profile-drawer">

            <div className="drawer-header">
              <span className="drawer-title">Student Profile</span>
              <button className="drawer-close-btn" onClick={handleCloseDrawer}>✕</button>
            </div>

            {profileLoading ? (
              <div className="drawer-loading">Loading profile...</div>
            ) : studentProfile ? (
              <>
                {/* Avatar + name */}
                <div className="drawer-avatar-row">
                  <div className="drawer-avatar">
                    {(studentProfile.name || selectedApp.usn).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="drawer-student-name">{studentProfile.name || '—'}</p>
                    <p className="drawer-student-usn">{selectedApp.usn}</p>
                  </div>
                </div>

                {/* Student details */}
                <div className="drawer-section-label">Student Details</div>
                <div className="drawer-fields">
                  <div className="drawer-field-row">
                    <span className="df-label">Email</span>
                    <span className="df-value">{studentProfile.email || 'Not provided'}</span>
                  </div>
                  <div className="drawer-field-row">
                    <span className="df-label">Phone</span>
                    <span className="df-value">{studentProfile.phone || 'Not provided'}</span>
                  </div>
                  <div className="drawer-field-row">
                    <span className="df-label">Branch</span>
                    <span className="df-value">{branchFull(studentProfile.branch)}</span>
                  </div>
                  <div className="drawer-field-row">
                    <span className="df-label">CGPA</span>
                    <span className="df-value df-cgpa">{studentProfile.cgpa || 'Not provided'}</span>
                  </div>
                </div>

                {/* Application details */}
                
<div className="drawer-section-label">Application Details</div>
<div className="drawer-fields">
  <div className="drawer-field-row">
    <span className="df-label">Applied On</span>
    <span className="df-value">{formatDate(selectedApp.createdAt)}</span>
  </div>
  <div className="drawer-field-row">
    <span className="df-label">Status</span>
    <span className={`df-value status-badge ${statusClass(selectedApp.status)}`}>
      {selectedApp.status}
    </span>
  </div>
</div>
                {/* Quick actions if still pending */}
                {selectedApp.status === 'Pending' && (
                  <div className="drawer-action-row">
                    <button
                      className="btn-accept drawer-action-btn"
                      onClick={() => handleStatusChange(selectedApp._id, 'Accepted')}
                    >
                      ✓ Accept
                    </button>
                    <button
                      className="btn-reject drawer-action-btn"
                      onClick={() => handleStatusChange(selectedApp._id, 'Rejected')}
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="drawer-no-profile">
                <p>No profile found for <strong>{selectedApp.usn}</strong>.</p>
                <p>The student may not have completed their profile yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MonitorApplications;