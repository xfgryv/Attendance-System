import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axios";
import QrCodeModal from "../components/QrCodeModal";
import LocationModal from "../components/LocationModal"; // 1. Import the new LocationModal

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrToken, setQrToken] = useState("");
  const [selectedCourseName, setSelectedCourseName] = useState("");

  // 2. ADD NEW STATE FOR THE LOCATION MODAL
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true); // Ensure loading is true when re-fetching
    try {
      const response = await apiClient.get('/dashboard/faculty');
      setDashboardData(response.data.data);
    } catch (err) {
      setError("Failed to fetch dashboard data. Please log in again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddCourse = async (courseData) => {
    try {
      await apiClient.post('/courses', courseData);
      setShowAddCourseModal(false);
      fetchDashboardData(); 
    } catch (err) {
      alert(err.response?.data?.message || "Could not add course.");
    }
  };

  const handleStartSession = async (courseId, courseName) => {
    try {
      const response = await apiClient.post('/attendance/generate-qr', { courseId });
      setQrToken(response.data.data.qrToken);
      setSelectedCourseName(courseName);
      setShowQrModal(true);
    } catch (err){
      alert(err.response?.data?.message || "Could not start session.");
    }
  };

  // 3. ADD A HANDLER FUNCTION TO SAVE THE LOCATION
  const handleSetLocation = async (latitude, longitude) => {
    if (!selectedCourse) return;

    try {
        await apiClient.patch(`/courses/${selectedCourse._id}/location`, {
            latitude,
            longitude
        });
        alert("Course location saved successfully!");
        setShowLocationModal(false);
        fetchDashboardData(); // Refresh data to show updated course info
    } catch (err) {
        alert(err.response?.data?.message || "Failed to save location.");
    }
  };


  const handleLogout = async () => {
    try {
      await apiClient.post("/faculty/logout");
    } finally {
      navigate("/");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 text-white p-6 text-center">Loading...</div>;
  }
  if (error) {
    return <div className="min-h-screen bg-gray-900 text-white p-6 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header and Faculty Info (no changes here) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm">Logout</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded-xl shadow">
          <p className="text-gray-400">Employee ID</p>
          <p className="text-xl font-semibold">{dashboardData?.teacherId}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow">
          <p className="text-gray-400">Employee Name</p>
          <p className="text-xl font-semibold">{dashboardData?.facultyName}</p>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-gray-800 p-6 rounded-xl shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Courses</h2>
          <button onClick={() => setShowAddCourseModal(true)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">+ Add Course</button>
        </div>
        {(dashboardData?.courses || []).length === 0 ? (
          <p className="text-gray-400">No courses added yet.</p>
        ) : (
          <ul className="space-y-2">
            {(dashboardData?.courses || []).map((course) => (
              <li key={course._id} className="flex flex-wrap justify-between items-center bg-gray-700 p-3 rounded-lg gap-2">
                <div>
                  <p className="font-semibold">{course.courseName}</p>
                  <p className="text-sm text-gray-400">Code: {course.courseCode}</p>
                  <p className={`text-xs mt-1 ${course.location ? 'text-green-400' : 'text-yellow-400'}`}>
                    {course.location ? `Location Set: (${course.location.latitude}, ${course.location.longitude})` : 'Location Not Set'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{(course.students || []).length} Student(s)</span>
                  {/* 4. ADD THE "SET LOCATION" BUTTON */}
                  <button
                    onClick={() => {
                        setSelectedCourse(course);
                        setShowLocationModal(true);
                    }}
                    className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-lg text-xs font-bold"
                  >
                    Set Location
                  </button>
                  <button 
                    onClick={() => handleStartSession(course._id, course.courseName)}
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-xs font-bold"
                  >
                    Start Session
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modals */}
      {showAddCourseModal && (
        <AddCourseModal onClose={() => setShowAddCourseModal(false)} onAddCourse={handleAddCourse} />
      )}
      <QrCodeModal 
        isOpen={showQrModal} 
        onClose={() => setShowQrModal(false)} 
        token={qrToken} 
        courseName={selectedCourseName} 
      />
      {/* 5. RENDER THE NEW LOCATION MODAL */}
      <LocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSave={handleSetLocation}
        course={selectedCourse}
      />
    </div>
  );
}

// AddCourseModal component (no changes needed)
function AddCourseModal({ onClose, onAddCourse }) {
    const [courseName, setCourseName] = useState("");
    const [courseCode, setCourseCode] = useState("");
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!courseName || !courseCode) {
        alert("Please fill out both fields.");
        return;
      }
      onAddCourse({ courseName, courseCode });
    };
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4">Add New Course</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="courseName"
              placeholder="Course Name (e.g., Machine Learning)"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-500"
            />
            <input
              type="text"
              name="courseCode"
              placeholder="Course Code (e.g., CS-401)"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-500"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Add Course
              </button>
            </div>
          </form>
        </div>
      </div>
    );
}