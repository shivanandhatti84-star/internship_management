import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/Internships.css';

function ViewInternships({ user }) {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadInternships();
    loadApplications();
  }, []);

  // ================= LOAD INTERNSHIPS =================
  const loadInternships = async () => {
    try {
      const res = await fetch('https://internship-management-uhf3.onrender.com/internships');
      const data = await res.json();
      setInternships(data);
    } catch (error) {
      console.error(error);
      alert('Failed to load internships');
    }
  };

  // ================= LOAD APPLICATIONS =================
  const loadApplications = async () => {
    try {
      const res = await fetch('https://internship-management-uhf3.onrender.com/applications');
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error(error);
    }
  };

  // One application only
  const hasAppliedAnywhere = () => {
    return applications.some(app => app.usn === user?.usn);
  };

  // Applied to this internship
  const hasAppliedToThis = (internshipId) => {
    return applications.some(
      app => app.internshipId === internshipId && app.usn === user?.usn
    );
  };

  // ================= APPLY =================
  const handleApply = async (internship) => {
    if (internship.slots <= 0) {
      alert('No slots available for this internship.');
      return;
    }

    if (hasAppliedAnywhere()) {
      alert(
        'You have already submitted an application. Only one application is allowed.'
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to apply to ${internship.company}?\n\nOnly ONE application allowed.`
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await fetch('https://internship-management-uhf3.onrender.com/applications/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usn: user?.usn,
          company: internship.company,
          internshipId: internship._id,
        }),
      });

      const data = await res.text();

      alert(data);

      loadInternships();
      loadApplications();
    } catch (error) {
      console.error(error);
      alert('Application failed');
    }

    setLoading(false);
  };

  const alreadyApplied = hasAppliedAnywhere();
  const filteredInternships = internships.filter((internship) =>
  internship.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  internship.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  internship.duration?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  internship.description?.toLowerCase().includes(searchTerm.toLowerCase())
);
  return (
    <div className="page">
      <Header showNav={true} />

      <div className="internships-container">
        <div className="page-header">
          <h2>Available Internships</h2>

          <button
            className="btn-back"
            onClick={() => navigate('/student/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      <div className="search-container">
    <input
    type="text"
    placeholder="Search internships..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
      className="search-input"
        />
      </div>
        {alreadyApplied && (
          <div className="applied-banner">
            You have already submitted an application. Only one application is
            allowed per student.
          </div>
        )}

        {filteredInternships.length === 0 ? (
          <div className="empty-state">
            <p>No internships available at the moment.</p>
          </div>
        ) : (
          <div className="internships-grid">
           {filteredInternships.map((internship) => {
              const appliedHere = hasAppliedToThis(internship._id);

              return (
                <div key={internship._id} className="internship-card">
                  <div className="card-header">
                    <h3>{internship.company}</h3>

                    <span
                      className={`slots-badge ${
                        internship.slots > 0 ? 'available' : 'full'
                      }`}
                    >
                      {internship.slots > 0
                        ? `${internship.slots} slots`
                        : 'Full'}
                    </span>
                  </div>

                  <div className="card-content">
                    <div className="info-row">
                      <span className="label">Location:</span>
                      <span className="value">{internship.location}</span>
                    </div>

                    <div className="info-row">
                      <span className="label">Duration:</span>
                      <span className="value">{internship.duration}</span>
                    </div>

                    <div className="info-row">
                      <span className="label">Start Date:</span>
                      <span className="value">{internship.startDate}</span>
                    </div>

                    <div className="info-row">
                      <span className="label">Stipend:</span>
                      <span className="value stipend">
                        Rs.{internship.stipend}
                      </span>
                    </div>

                    <div className="info-row">
                      <span className="label">Description:</span>
                      <span className="value">
                        {internship.description || 'No description'}
                      </span>
                    </div>
                  </div>

                  <div className="card-footer">
                    {appliedHere ? (
                      <button className="btn-submitted" disabled>
                        Application Submitted
                      </button>
                    ) : alreadyApplied ? (
                      <button className="btn-applied" disabled>
                        Already Applied Elsewhere
                      </button>
                    ) : internship.slots <= 0 ? (
                      <button className="btn-applied" disabled>
                        Slots Full
                      </button>
                    ) : (
                      <button
                        className="btn-apply"
                        onClick={() => handleApply(internship)}
                        disabled={loading}
                      >
                        {loading ? 'Applying...' : 'Apply Now'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewInternships;
