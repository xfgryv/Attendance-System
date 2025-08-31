import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { ClassSession } from "../models/classSession.models.js";
import { Attendance } from "../models/attendance.models.js";
import { Course } from "../models/course.models.js";
import jwt from "jsonwebtoken";

// This function now creates the session and returns a token for the frontend to render.
const generateAttendanceQR = asyncHandler(async (req, res) => {
    const { courseId } = req.body;
    const facultyId = req.user._id;

    if (!courseId) {
        throw new ApiError(400, "Course ID is required.");
    }

    const course = await Course.findOne({ _id: courseId, faculty: facultyId });
    if (!course) {
        throw new ApiError(403, "Access denied. You are not the faculty for this course.");
    }

    // Generate current date and time values
    const now = new Date();
    const startTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const endTime = new Date(now.getTime() + 60 * 60 * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Create a new class session
    const newSession = await ClassSession.create({
        course: courseId,
        faculty: facultyId,
        qrCodeExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
        classDate: now,
        startTime: startTime,
        endTime: endTime,
        classType: 'offline', // Assuming QR is for offline class
        status: 'ongoing'
    });

    const qrToken = jwt.sign(
        { sessionId: newSession._id },
        process.env.QR_CODE_SECRET,
        { expiresIn: '5m' }
    );

    return res.status(200).json(
        new apiResponse(200, { qrToken }, "QR code token generated successfully.")
    );
});

// This function is for the student side, which includes location verification.
const markAttendanceViaQR = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { latitude, longitude } = req.body;
    const studentId = req.user._id;

    if (!token) {
        throw new ApiError(400, "Attendance token is missing.");
    }

    if (!latitude || !longitude) {
        throw new ApiError(400, "Location data is missing. Unable to mark attendance.");
    }
    
    const decodedToken = jwt.verify(token, process.env.QR_CODE_SECRET);
    const { sessionId } = decodedToken;

    const classSession = await ClassSession.findById(sessionId).populate('course');
    if (!classSession || classSession.qrCodeExpiresAt < new Date()) {
        throw new ApiError(400, "Invalid or expired attendance session.");
    }

    const courseLocation = classSession.course.location;
    if (!courseLocation || !courseLocation.latitude || !courseLocation.longitude) {
        throw new ApiError(500, "Course location is not set. Contact the faculty.");
    }

    // Calculate distance between student and course location
    const distance = getDistance(
        latitude,
        longitude,
        courseLocation.latitude,
        courseLocation.longitude
    );

    // Set an acceptable distance threshold (e.g., 50 meters)
    const allowedDistance = 50;
    if (distance > allowedDistance) {
        throw new ApiError(403, "You are not in the correct location to mark attendance.");
    }

    const existingAttendance = await Attendance.findOne({ student: studentId, classSession: sessionId });
    if (existingAttendance) {
        return res.status(200).json(new apiResponse(200, {}, "Attendance already marked."));
    }

    await Attendance.create({
        student: studentId,
        classSession: sessionId,
        latitude: latitude,
        longitude: longitude
    });

    return res.status(200).json(new apiResponse(200, {}, "Attendance marked successfully!"));
});

// Helper function to calculate distance in meters (haversine formula)
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in metres
    return distance;
}

export { generateAttendanceQR, markAttendanceViaQR };