// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import StudentDashboard from './pages/student/StudentDashboard';
// import ViewInternships from './pages/student/ViewInternships';
// import ApplicationStatus from './pages/student/ApplicationStatus';
// import StudentProfile from './pages/student/StudentProfile';
// import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard';
// import AddInternship from './pages/coordinator/AddInternship';
// import MonitorApplications from './pages/coordinator/MonitorApplications';
// import MentorDashboard from './pages/mentor/MentorDashboard';
// import HODDashboard from './pages/hod/HODDashboard';
// import ProfileSetupGuard from './pages/student/ProfileSetupGuard';
// import './styles/App.css';

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [userRole, setUserRole] = useState(null);
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     // Check if user is already logged in
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       const user = JSON.parse(storedUser);
//       setIsAuthenticated(true);
//       setUserRole(user.role);
//       setUserData(user);
//     }
//   }, []);

//   const handleLogin = (user) => {
//     setIsAuthenticated(true);
//     setUserRole(user.role);
//     setUserData(user);
//     localStorage.setItem('user', JSON.stringify(user));
//   };

//   const handleLogout = () => {
//     setIsAuthenticated(false);
//     setUserRole(null);
//     setUserData(null);
//     localStorage.removeItem('user');
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/login" element={<Login onLogin={handleLogin} />} />
//         <Route path="/register" element={<Register />} />

//         {/* Protected Routes - Student */}
//         {isAuthenticated && userRole === 'student' ? (
//           <>
//             <Route path="/student/dashboard" element={<StudentDashboard onLogout={handleLogout} user={userData} />} />
//             <Route path="/student/internships" element={<ViewInternships user={userData} />} />
//             <Route path="/student/status" element={<ApplicationStatus user={userData} />} />
//             <Route path="/student/profile" element={<StudentProfile user={userData} />} />
//           </>
//         ) : null}

//         {/* Protected Routes - Coordinator */}
//         {isAuthenticated && userRole === 'coordinator' ? (
//           <>
//             <Route path="/coordinator/dashboard" element={<CoordinatorDashboard onLogout={handleLogout} user={userData} />} />
//             <Route path="/coordinator/add-internship" element={<AddInternship user={userData} />} />
//             <Route path="/coordinator/monitor" element={<MonitorApplications user={userData} />} />
//           </>
//         ) : null}

//         {/* Protected Routes - Mentor */}
//         {isAuthenticated && userRole === 'mentor' ? (
//           <Route path="/mentor/dashboard" element={<MentorDashboard onLogout={handleLogout} user={userData} />} />
//         ) : null}

//         {/* Protected Routes - HOD */}
//         {isAuthenticated && userRole === 'hod' ? (
//           <Route path="/hod/dashboard" element={<HODDashboard onLogout={handleLogout} user={userData} />} />
//         ) : null}

//         {/* Default redirect */}
//         <Route path="/" element={<Navigate to={isAuthenticated ? `/${userRole}/dashboard` : '/login'} />} />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;






import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/StudentDashboard';
import ViewInternships from './pages/student/ViewInternships';
import ApplicationStatus from './pages/student/ApplicationStatus';
import StudentProfile from './pages/student/StudentProfile';
import StudentEvaluationResults from './pages/student/StudentEvaluationResults';
import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard';
import AddInternship from './pages/coordinator/AddInternship';
import MonitorApplications from './pages/coordinator/MonitorApplications';
import MentorDashboard from './pages/mentor/MentorDashboard';
import HODDashboard from './pages/hod/HODDashboard';
import ProfileSetupGuard from './pages/student/ProfileSetupGuard';
import DepartmentStats from './pages/hod/DepartmentStats';
import MentorDetails from './pages/hod/MentorDetails';
import AssignMentor from './pages/coordinator/AssignMentor';
import EvaluationReports from './pages/mentor/EvaluationReports';
import StudentProgress from './pages/mentor/StudentProgress';
import StudentProfiles from './pages/mentor/StudentProfiles';


import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUserRole(user.role);
      setUserData(user);
    }
  }, []);

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setUserRole(user.role);
    setUserData(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserData(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Student (wrapped with ProfileSetupGuard) */}
        {isAuthenticated && userRole === 'student' ? (
          <>
            <Route path="/student/dashboard" element={
              <ProfileSetupGuard user={userData}>
                <StudentDashboard onLogout={handleLogout} user={userData} />
              </ProfileSetupGuard>
            } />
            <Route path="/student/internships" element={
              <ProfileSetupGuard user={userData}>
                <ViewInternships user={userData} />
              </ProfileSetupGuard>
            } />
            <Route path="/student/status" element={
              <ProfileSetupGuard user={userData}>
                <ApplicationStatus user={userData} />
              </ProfileSetupGuard>
            } />
            {/* Profile page does NOT need the guard — student is editing here */}
            <Route path="/student/profile" element={<StudentProfile user={userData} />} />
            <Route path="/student/evaluation-results" element={<StudentEvaluationResults user={userData} />} />
          </>
        ) : null}

        {/* Protected Routes - Coordinator */}
        {isAuthenticated && userRole === 'coordinator' ? (
          <>
            <Route path="/coordinator/dashboard" element={<CoordinatorDashboard onLogout={handleLogout} user={userData} />} />
            <Route path="/coordinator/add-internship" element={<AddInternship user={userData} />} />
            <Route path="/coordinator/monitor" element={<MonitorApplications user={userData} />} />
            <Route path="/coordinator/assign-mentor" element={<AssignMentor />} />
          </>
        ) : null}

{/* Protected Routes - Mentor */}
{isAuthenticated && userRole === 'mentor' ? (
  <>
    <Route
      path="/mentor/dashboard"
      element={<MentorDashboard onLogout={handleLogout} user={userData} />}
    />

    <Route
      path="/mentor/evaluation"
      element={<EvaluationReports user={userData} />}
    />

    <Route
      path="/mentor/progress"
      element={<StudentProgress user={userData} />}
    />

     <Route
      path="/mentor/student-profiles"
      element={<StudentProfiles user={userData} />}
    /> 
  </>
) : null}


       {/* Protected Routes - HOD */}
{isAuthenticated && userRole === 'hod' ? (
  <>
    <Route
      path="/hod/dashboard"
      element={
        <HODDashboard
          onLogout={handleLogout}
          user={userData}
        />
      }
    />

    <Route
      path="/hod/mentor-details"
      element={<MentorDetails />}
    />

    <Route
      path="/hod/department-stats"
      element={<DepartmentStats />}
    />
  </>
) : null}

        {/* Default redirect */}
        <Route path="/" element={<Navigate to={isAuthenticated ? `/${userRole}/dashboard` : '/login'} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;