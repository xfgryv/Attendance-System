// src/pages/Dashboard.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { BookOpen, BarChart2, Clock, Scan } from "lucide-react";
import apiClient from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get('/dashboard/student');
        setDashboardData(response.data.data);
      } catch (err) {
        setError("Failed to fetch dashboard data. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
        await apiClient.post('/users/logout');
        navigate("/");
    } catch (err) {
        console.error("Logout failed:", err);
        navigate("/");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">{dashboardData.studentName}</h1>
          <p className="text-gray-300">Student ID: {dashboardData.studentId}</p>
        </div>
        <div className="flex gap-2">
        <Button
            variant="outline"
            className="text-white border-blue-500 bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate("/enroll")}
        >
            Enroll in Courses
        </Button>
        <Button
              variant="outline"
              className="text-white border-green-500 bg-green-600 hover:bg-green-700"
              onClick={() => navigate("/mark-attendance")}
          >
              <Scan className="h-5 w-5 mr-2" /> Mark Attendance
          </Button>
          <Button
            variant="outline"
            className="text-white border-gray-500"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="space-y-6">
        {/* Subjects / Courses */}
        <Card className="bg-gray-900 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">My Enrolled Courses</h2>
            </div>
            <div className="space-y-4">
              {dashboardData.subjects && dashboardData.subjects.length > 0 ? (
                dashboardData.subjects.map((course) => (
                  <div key={course._id} className="bg-gray-800 p-3 rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-white">{course.courseName}</span>
                      <span className="font-bold text-white">{course.attendancePercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${course.attendancePercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-gray-400 text-sm">
                            Faculty: {course.facultyName}
                        </p>
                        {/* --- THIS IS THE CORRECT LOCATION FOR THE BUTTON --- */}
                        <Button 
                            size="sm" 
                            variant="link" 
                            className="text-blue-400"
                            onClick={() => navigate(`/analytics/course/${course._id}`)}
                        >
                            View Details
                        </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">You have not enrolled in any courses yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Card - REMOVED the button from here */}
        <Card className="bg-gray-900 text-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Overall Analytics</h2>
            </div>
            <p className="text-3xl font-bold text-blue-400">{dashboardData.analytics.overallAttendance}%</p>
            <p className="text-gray-300">Overall Attendance</p>
            <div className="mt-4 space-y-1">
              <p>
                Total Present Days: <span className="text-blue-300">{dashboardData.analytics.presentDays}</span>
              </p>
              <p>
                Total Class Days: <span className="text-blue-300">{dashboardData.analytics.totalDays}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Today's Courses Card (No changes) */}
        <Card className="bg-gray-900 text-white">
            {/* ... This card remains the same ... */}
        </Card>
      </div>
    </div>
  );
}