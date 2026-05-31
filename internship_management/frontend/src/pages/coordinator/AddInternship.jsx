// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../../components/Header';
// import '../../styles/AddInternship.css';

// function AddInternship({ user }) {
//   const [internships, setInternships] = useState([]);
//   const [formData, setFormData] = useState({
//     company: '',
//     location: '',
//     duration: '',
//     startDate: '',
//     stipend: '',
//     slots: '',
//     description: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadInternships();
//   }, []);

//   // ================= LOAD FROM DATABASE =================
//   const loadInternships = async () => {
//     try {
//       const res = await fetch('https://internship-management-uhf3.onrender.com/internships');
//       const data = await res.json();
//       setInternships(data);
//     } catch (error) {
//       console.error(error);
//       alert('Failed to load internships');
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   // ================= ADD INTERNSHIP =================
//   const handleAddInternship = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch('https://internship-management-uhf3.onrender.com/internships/add', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           company: formData.company,
//           location: formData.location,
//           duration: formData.duration,
//           startDate: formData.startDate,
//           stipend: formData.stipend,
//           slots: parseInt(formData.slots),
//           description: formData.description,
//         }),
//       });

//       const data = await res.text();

//       alert(data);

//       // Reset form
//       setFormData({
//         company: '',
//         location: '',
//         duration: '',
//         startDate: '',
//         stipend: '',
//         slots: '',
//         description: '',
//       });

//       loadInternships();
//     } catch (error) {
//       console.error(error);
//       alert('Failed to add internship');
//     }

//     setLoading(false);
//   };

//   // ================= DELETE =================
//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this internship?')) {
//       try {
//         await fetch(`https://internship-management-uhf3.onrender.com/internships/${id}`, {
//           method: 'DELETE',
//         });

//         alert('Internship deleted');
//         loadInternships();
//       } catch (error) {
//         console.error(error);
//         alert('Delete failed');
//       }
//     }
//   };

//   return (
//     <div className="page">
//       <Header showNav={true} />

//       <div className="add-internship-container">
//         <div className="page-header">
//           <h2>Add Internship</h2>
//           <button
//             className="btn-back"
//             onClick={() => navigate('/coordinator/dashboard')}
//           >
//             ← Back to Dashboard
//           </button>
//         </div>

//         <div className="add-form-card">
//           <h3>New Internship</h3>

//           <form onSubmit={handleAddInternship} className="internship-form">
//             <div className="form-row">
//               <div className="form-group">
//                 <label>Company Name *</label>
//                 <input
//                   type="text"
//                   name="company"
//                   placeholder="Enter company name"
//                   value={formData.company}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Duration *</label>
//                 <input
//                   type="text"
//                   name="duration"
//                   placeholder="e.g., 2 months"
//                   value={formData.duration}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Start Date *</label>
//                 <input
//                   type="date"
//                   name="startDate"
//                   value={formData.startDate}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Stipend (₹) *</label>
//                 <input
//                   type="number"
//                   name="stipend"
//                   placeholder="Enter stipend amount"
//                   value={formData.stipend}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Number of Slots *</label>
//                 <input
//                   type="number"
//                   name="slots"
//                   placeholder="Enter number of slots"
//                   value={formData.slots}
//                   onChange={handleInputChange}
//                   min="1"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="form-group full-width">
//               <label>Description</label>
//               <textarea
//                 name="description"
//                 placeholder="Enter job description (optional)"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows="4"
//               />
//             </div>

//             <button type="submit" className="btn-add" disabled={loading}>
//               {loading ? 'Adding...' : 'Add Internship'}
//             </button>
//           </form>
//         </div>

//         {internships.length > 0 && (
//           <div className="internships-list-card">
//             <h3>Posted Internships ({internships.length})</h3>

//             <div className="internships-list">
//               {internships.map((internship) => (
//                 <div key={internship._id} className="list-item">
//                   <div className="item-header">
//                     <h4>{internship.company}</h4>
//                   </div>

//                   <div className="item-details">
//                     <span>📍 {internship.location}</span>
//                     <span>⏱️ {internship.duration}</span>
//                     <span>💰 ₹{internship.stipend}</span>
//                     <span>👥 {internship.slots} slots</span>
//                   </div>

//                   <button
//                     className="btn-delete"
//                     onClick={() => handleDelete(internship._id)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AddInternship;








import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import '../../styles/AddInternship.css';

function AddInternship({ user }) {
  const [internships, setInternships] = useState([]);
  const [formData, setFormData] = useState({
    company: '',
    location: '',
    duration: '',
    startDate: '',
    stipend: '',
    slots: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadInternships();
  }, []);

  // ================= LOAD FROM DATABASE =================
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ================= ADD INTERNSHIP =================
  const handleAddInternship = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('https://internship-management-uhf3.onrender.com/internships/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: formData.company,
          location: formData.location,
          duration: formData.duration,
          startDate: formData.startDate,
          stipend: formData.stipend,
          slots: parseInt(formData.slots),
          description: formData.description,
        }),
      });

      const data = await res.text();

      alert(data);

      // Reset form
      setFormData({
        company: '',
        location: '',
        duration: '',
        startDate: '',
        stipend: '',
        slots: '',
        description: '',
      });

      loadInternships();
    } catch (error) {
      console.error(error);
      alert('Failed to add internship');
    }

    setLoading(false);
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        await fetch(`https://internship-management-uhf3.onrender.com/internships/${id}`, {
          method: 'DELETE',
        });

        alert('Internship deleted');
        loadInternships();
      } catch (error) {
        console.error(error);
        alert('Delete failed');
      }
    }
  };

  return (
    <div className="page">
      <Header showNav={true} />

      <div className="add-internship-container">
        <div className="page-header">
          <h2>Add Internship</h2>
          <button
            className="btn-back"
            onClick={() => navigate('/coordinator/dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="add-form-card">
          <h3>New Internship</h3>

          <form onSubmit={handleAddInternship} className="internship-form">
            <div className="form-row">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Enter company name"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Duration *</label>
                <input
                  type="text"
                  name="duration"
                  placeholder="e.g., 2 months"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Stipend (₹) *</label>
                <input
                  type="number"
                  name="stipend"
                  placeholder="Enter stipend amount"
                  value={formData.stipend}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Number of Slots *</label>
                <input
                  type="number"
                  name="slots"
                  placeholder="Enter number of slots"
                  value={formData.slots}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Enter job description (optional)"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <button type="submit" className="btn-add" disabled={loading}>
              {loading ? 'Adding...' : 'Add Internship'}
            </button>
          </form>
        </div>

        {internships.length > 0 && (
          <div className="internships-list-card">
            <h3>Posted Internships ({internships.length})</h3>

            <div className="internships-list">
              {internships.map((internship) => (
                <div key={internship._id} className="list-item">
                  <div className="item-header">
                    <h4>{internship.company}</h4>
                  </div>

                  <div className="item-details">
                    <span>📍 {internship.location}</span>
                    <span>⏱️ {internship.duration}</span>
                    <span>💰 ₹{internship.stipend}</span>
                    <span>👥 {internship.slots} slots</span>
                  </div>

                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(internship._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddInternship;
