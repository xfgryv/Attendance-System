// src/pages/AttendanceDashboard.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend, ResponsiveContainer,
} from "recharts";
import apiClient from "../api/axios";

export default function AttendanceDashboard() {
  const { courseId } = useParams(); // Get courseId from URL
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) return;

    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/analytics/course/${courseId}`);
        setAnalyticsData(response.data.data);
      } catch (err) {
        setError("Failed to load analytics data.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [courseId]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 text-white p-6 text-center">Loading Analytics...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-900 text-white p-6 text-center">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Course Analytics</h1>
          <p className="text-gray-400">
            Your detailed attendance breakdown for this course.
          </p>
        </div>
        <div>
          <Link to="/dashboard" className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Overall Attendance</h2>
          <p className="text-3xl font-bold mt-2">{analyticsData?.overallAttendance.toFixed(0)}%</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Classes Attended</h2>
          <p className="text-3xl font-bold mt-2">
            {analyticsData?.classesAttended}/{analyticsData?.totalClasses}
          </p>
        </div>
        {/* These are now placeholders as backend logic for them is complex */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">This Week</h2>
          <p className="text-3xl font-bold mt-2">N/A</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Best Streak</h2>
          <p className="text-3xl font-bold mt-2">N/A</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Weekly Attendance Trend (Placeholder)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analyticsData?.weeklyAttendance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="week" stroke="#bbb" />
              <YAxis stroke="#bbb" />
              <Tooltip />
              <Line type="monotone" dataKey="percent" stroke="#4f83ff" strokeWidth={3} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Monthly Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData?.monthlyBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="month" stroke="#bbb" />
              <YAxis stroke="#bbb" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Present" fill="#4f83ff" />
              <Bar dataKey="Absent" fill="#ff4f4f" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}