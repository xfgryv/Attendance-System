import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Course } from "../models/course.models.js";
import { ClassSession } from "../models/classSession.models.js";
import { Attendance } from "../models/attendance.models.js";

// --- STUDENT DASHBOARD ---
// In src/controllers/dashboard.controller.js

const getStudentDashboard = asyncHandler(async (req, res) => {
    const student = req.user;

    const enrolledCourses = await Course.find({
        '_id': { $in: student.courses }
    }).populate('faculty', 'name');

    // --- THIS LINE HAS BEEN FIXED ---
    const courseAttendanceData = await Promise.all(enrolledCourses.map(async (course) => {
        const sessionIds = (await ClassSession.find({ course: course._id }).select('_id')).map(s => s._id);
        const totalClasses = sessionIds.length;
        const attendedClasses = await Attendance.countDocuments({
            student: student._id,
            classSession: { $in: sessionIds }
        });
        return {
            _id: course._id,
            courseName: course.courseName,
            facultyName: course.faculty?.name ?? 'N/A',
            attendancePercentage: totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0,
        };
    }));

    // (The rest of the function is the same)
    const allClassSessions = await ClassSession.find({}).select('_id');
    const allSessionIds = allClassSessions.map(session => session._id);

    const totalClassesOverall = allSessionIds.length;
    const presentDaysOverall = await Attendance.countDocuments({
        student: student._id,
        classSession: { $in: allSessionIds }
    });
    const overallAttendancePercentage = totalClassesOverall > 0 ? Math.round((presentDaysOverall / totalClassesOverall) * 100) : 0;

    const analytics = {
        overallAttendance: overallAttendancePercentage,
        presentDays: presentDaysOverall,
        totalDays: totalClassesOverall
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todaysClassesRaw = await ClassSession.find({
        classDate: { $gte: today, $lt: tomorrow }
    }).populate({ path: 'course', populate: { path: 'faculty', select: 'name' } }).sort({ startTime: 1 });

    const todaysClasses = todaysClassesRaw.map(cls => ({
        courseName: cls.course?.courseName ?? 'N/A',
        facultyName: cls.course?.faculty?.name ?? 'N/A',
        time: cls.startTime,
        type: cls.classType,
        status: cls.status
    }));
    
    const dashboardData = {
        studentName: student.name,
        studentId: student.studentId,
        subjects: courseAttendanceData,
        analytics: analytics,
        todaysClasses: todaysClasses
    };

    return res.status(200).json(new apiResponse(200, dashboardData, "Dashboard data fetched successfully."));
});

// --- FACULTY DASHBOARD ---
const getFacultyDashboard = asyncHandler(async (req, res) => {
    // --- ADD THIS DEBUG LINE ---
    console.log("--- FACULTY DASHBOARD CONTROLLER ---");
    console.log("req.user object:", req.user);
    console.log("------------------------------------");
    // -----------------------------

    const facultyId = req.user._id;
    const courses = await Course.find({ faculty: facultyId }).populate("faculty", "name").sort({ createdAt: -1 });

    const dashboardData = {
        facultyName: req.user.name,
        teacherId: req.user.teacherId,
        courses: courses 
    };

    return res.status(200).json(new apiResponse(200, dashboardData, "Faculty dashboard data fetched successfully."));
});

export { getStudentDashboard, getFacultyDashboard };