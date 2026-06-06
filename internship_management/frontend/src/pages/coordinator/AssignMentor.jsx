import API from '../../api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

import '../../styles/HOD.css';

function AssignMentor() {
  const [acceptedApps, setAcceptedApps] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [saving, setSaving] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchAccepted(); fetchMentors(); }, []);

  const fetchAccepted = async () => {
    try {
      const res = await fetch(`${API}/applications`);
      const data = await res.json();
      const accepted = data.filter(a => a.status === 'Accepted');
      setAcceptedApps(accepted);
      const map = {};
      accepted.forEach(a => { if (a.mentorUsn) map[a._id] = a.mentorUsn; });
      setAssignments(map);
    } catch { alert('Could not load applications.'); }
  };

  const fetchMentors = async () => {
    try {
      const res = await fetch(`${API}/auth/mentors`);
      const data = await res.json();
      setMentors(data);
    } catch { alert('Could not load mentors.'); }
  };

  const handleAssign = async (app) => {
    const mentorUsn = assignments[app._id];
    if (!mentorUsn) { alert('Please select a mentor first.'); return; }

    if (app.mentorUsn && app.mentorUsn !== mentorUsn) {
      const ok = window.confirm(`Reassign ${app.usn} from ${app.mentorUsn} to ${mentorUsn}?`);
      if (!ok) return;
    }

    setSaving(app._id);
    try {
      const res = await fetch(`${API}/applications/${app._id}/assign-mentor`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mentorUsn }),
      });
      const data = await res.text();
      if (data === 'Mentor assigned') { fetchAccepted(); alert(`Mentor ${mentorUsn} assigned to ${app.usn}!`); }
      else alert(data);
    } catch { alert('Error assigning mentor.'); }
    finally { setSaving(null); }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="page">
      <Header showNav={true} />
      <div className="hod-container">
        <div className="page-header">
          <h2>Accepted Students — Assign Mentor</h2>
          <button className="btn-back" onClick={() => navigate('/coordinator/dashboard')}>← Back to Dashboard</button>
        </div>

        {acceptedApps.length === 0 ? (
          <div className="empty-state"><p>No accepted students yet.</p></div>
        ) : (
          <div className="hod-table-card">
            <table className="hod-table">
              <thead>
                <tr><th>USN</th><th>Company</th><th>Applied Date</th><th>Assign Mentor</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {acceptedApps.map(app => (
                  <tr key={app._id}>
                    <td><strong>{app.usn}</strong></td>
                    <td>{app.company || app.internshipId?.company}</td>
                    <td>{formatDate(app.appliedDate)}</td>
                    <td>
                      {mentors.length === 0 ? (
                        <span className="no-mentors">No mentors registered</span>
                      ) : (
                        <select
                          className="mentor-select"
                          value={assignments[app._id] || ''}
                          onChange={e => setAssignments(prev => ({ ...prev, [app._id]: e.target.value }))}
                        >
                          <option value="">-- Select Mentor --</option>
                          {mentors.map(m => {
                            const mentorVal = m.name || m.usn;
                            return (
                              <option key={mentorVal} value={mentorVal}>
                                {m.name ? `${m.name} (${m.email})` : `${m.usn} (${m.email})`}
                              </option>
                            );
                          })}
                        </select>
                      )}
                    </td>
                    <td>
                      {app.mentorUsn
                        ? <span className="assigned-badge">✅ { (mentors.find(x => (x.name || x.usn) === app.mentorUsn)?.name) || app.mentorUsn }</span>
                        : <span className="unassigned-badge">⏳ Not Assigned</span>}
                    </td>
                    <td>
                      <button className="btn-assign" onClick={() => handleAssign(app)} disabled={mentors.length === 0 || saving === app._id}>
                        {saving === app._id ? '...' : app.mentorUsn ? 'Reassign' : 'Assign'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignMentor;
