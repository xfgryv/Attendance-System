// src/components/LocationModal.jsx

import { useState, useEffect } from "react";

export default function LocationModal({ isOpen, onClose, onSave, course }) {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // When the modal opens, pre-fill the inputs if a location already exists
  useEffect(() => {
    if (course?.location) {
      setLatitude(course.location.latitude || "");
      setLongitude(course.location.longitude || "");
    } else {
      setLatitude("");
      setLongitude("");
    }
  }, [course]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    if (!latitude || !longitude) {
      alert("Please provide both latitude and longitude.");
      return;
    }
    onSave(latitude, longitude);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">Set Location for Course</h2>
        <p className="text-blue-400 mb-4">{course?.courseName}</p>
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Latitude (e.g., 27.1751)"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-500"
          />
          <input
            type="number"
            placeholder="Longitude (e.g., 78.0421)"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-500"
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Save Location
          </button>
        </div>
      </div>
    </div>
  );
}