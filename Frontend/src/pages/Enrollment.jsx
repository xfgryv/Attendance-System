// src/pages/Enrollment.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/axios";

export default function Enrollment() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // --- 1. ADD STATE TO TRACK ENROLLED COURSES ---
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      // We also need to fetch the student's current data to know what they're enrolled in
      const [coursesResponse, userResponse] = await Promise.all([
        apiClient.get('/courses'),
        apiClient.get('/users/me') 
      ]);
      setCourses(coursesResponse.data.data);
      // Create a Set of enrolled course IDs for quick lookups
      setEnrolledCourses(new Set(userResponse.data.data.courses));
    } catch (err) {
      setError("Failed to fetch data.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // --- 2. CREATE THE ENROLLMENT HANDLER FUNCTION ---
  const handleEnroll = async (courseId) => {
    try {
      await apiClient.post(`/courses/${courseId}/enroll`);
      alert("Successfully enrolled in the course!");
      // Add the course to our local state to update the UI instantly
      setEnrolledCourses(prev => new Set(prev).add(courseId));
    } catch (err) {
      // Display the specific error message from the backend
      alert(err.response?.data?.message || "Enrollment failed.");
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-950 text-white p-6 text-center">Loading Courses...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-950 text-white p-6 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Enroll in a Course</h1>
          <Link to="/dashboard" className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm">
            Back to Dashboard
          </Link>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl shadow">
          {courses.length === 0 ? (
            <p className="text-gray-400">No courses are available for enrollment at this time.</p>
          ) : (
            <ul className="space-y-3">
              {courses.map((course) => {
                // --- 3. CHECK IF THE STUDENT IS ALREADY ENROLLED ---
                const isEnrolled = enrolledCourses.has(course._id);
                return (
                  <li key={course._id} className="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                    <div>
                      <p className="font-semibold text-lg">{course.courseName}</p>
                      <p className="text-sm text-gray-400">
                        Code: {course.courseCode} | Faculty: {course.faculty?.name ?? 'N/A'}
                      </p>
                    </div>
                    {/* --- 4. UPDATE THE BUTTON LOGIC --- */}
                    <button
                      onClick={() => handleEnroll(course._id)}
                      disabled={isEnrolled} // Disable button if already enrolled
                      className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                        isEnrolled
                          ? "bg-green-600 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isEnrolled ? "Enrolled" : "Enroll"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}