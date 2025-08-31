// src/pages/Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  LockClosedIcon,
  CameraIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import apiClient from "../api/axios";

export default function Login() {
  const [role, setRole] = useState("student");
  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [studentId, setStudentId] = useState("");
  // --- 1. ADD STATE FOR TEACHER ID ---
  const [teacherId, setTeacherId] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const endpoint = `/${role === 'student' ? 'users' : 'faculty'}/${mode}`;

    try {
      let response;
      if (mode === 'register') {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("gmail", email);
        formData.append("password", password);
        
        if (role === 'student') {
          formData.append("studentId", studentId);
          if (image) {
            formData.append("profileImage", image);
          }
        } else { // Faculty registration
          // --- 3. APPEND TEACHER ID FOR FACULTY ---
          formData.append("teacherId", teacherId);
        }
        
        response = await apiClient.post(endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

      } else { // Login logic
        const loginPayload = { gmail: email, password };
        response = await apiClient.post(endpoint, loginPayload);
      }

      console.log("Success:", response.data);
      if (role === "student") {
        navigate("/dashboard");
      } else {
        navigate("/faculty-dashboard");
      }

    } catch (err) {
      console.error("API Error:", err);
      const errorMessage = err.response?.data?.message || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('background.png')" }}
    >
      <div className="flex flex-col md:flex-row w-11/12 md:w-9/12 lg:w-8/12">
        {/* Left Section */}
        <div className="flex-1 text-white p-8 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Smart <span className="text-blue-500">Attendance</span> Management
          </h1>
          <p className="mt-6 text-gray-300 max-w-lg">
            Streamline your educational institution's attendance tracking with
            our modern, efficient system designed for both students and faculty.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-black/50 backdrop-blur-md p-8 rounded-2xl w-full max-w-md shadow-lg">
            {/* Top icons and toggles */}
            <div className="flex justify-center mb-4">
              {role === "student" ? (
                <div className="relative group">
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Profile Preview"
                      className="h-20 w-20 rounded-full object-cover border-2 border-blue-600"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full flex items-center justify-center bg-gray-700 border-2 border-dashed border-gray-500 text-gray-400 relative">
                      <UserIcon className="h-10 w-10" />
                      <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1">
                        <CameraIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="bg-blue-600 p-4 rounded-full">
                  <AcademicCapIcon className="h-10 w-10 text-white" />
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold text-center text-white">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-400 text-center mb-6">
              {mode === "login"
                ? "Sign in to your attendance account"
                : "Register a new account"}
            </p>
            {/* Role & Mode Toggles */}
            <div className="flex mb-4 bg-gray-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition ${
                  role === "student"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <UserIcon className="h-5 w-5" /> Student
              </button>
              <button
                type="button"
                onClick={() => setRole("faculty")}
                className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition ${
                  role === "faculty"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <AcademicCapIcon className="h-5 w-5" /> Faculty
              </button>
            </div>

            <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-2 rounded-md text-sm font-medium ${
                  mode === "login"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`flex-1 py-2 rounded-md text-sm font-medium ${
                  mode === "register"
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Register
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded-md">
                  {error}
                </p>
              )}

              {/* Register-only fields */}
              {mode === "register" && (
                <>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2 bg-gray-900/70 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                  {/* --- 2. ADD INPUT FIELD FOR STUDENT/TEACHER ID --- */}
                  {role === 'student' && (
                    <div className="relative">
                      <IdentificationIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)}
                        placeholder="Enter your Student ID"
                        className="w-full pl-10 pr-4 py-2 bg-gray-900/70 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                  )}
                  {role === 'faculty' && (
                    <div className="relative">
                      <IdentificationIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text" value={teacherId} onChange={(e) => setTeacherId(e.target.value)}
                        placeholder="Enter your Teacher ID"
                        className="w-full pl-10 pr-4 py-2 bg-gray-900/70 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                  )}
                </>
              )}
              
              {/* Always visible fields */}
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/70 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/70 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-medium py-2 rounded-lg disabled:bg-blue-400 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading 
                  ? 'Processing...' 
                  : (mode === "login"
                    ? `Sign In as ${role === "student" ? "Student" : "Faculty"}`
                    : `Register as ${role === "student" ? "Student" : "Faculty"}`)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}