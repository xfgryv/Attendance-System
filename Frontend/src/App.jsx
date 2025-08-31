import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";              // ✅ use existing Login page
import FacultyDashboard from "./pages/FacultyDashboard";
import Dashboard from "./pages/Dashboard";      // student dashboard
import AttendanceDashboard from "./pages/AttendanceDashboard";
import Enrollment from "./pages/Enrollment";
import StudentAttendance from "./pages/StudentAttendance";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />   
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/Attendance-Dash" element={<AttendanceDashboard />}/> 
        <Route path="/enroll" element={<Enrollment />} /> {/* <-- 2. Add the new route */}
        <Route path="/mark-attendance" element={<StudentAttendance />} />
      </Routes>
    </Router>
  );
}
