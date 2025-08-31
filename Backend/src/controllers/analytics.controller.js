// src/controllers/analytics.controller.js

import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Attendance } from "../models/attendance.models.js";
import { ClassSession } from "../models/classSession.models.js";

const getCourseAnalyticsForStudent = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user._id;

    // 1. Calculate Overall Stats for this specific course
    const allSessionsInCourse = await ClassSession.find({ course: courseId });
    const totalClasses = allSessionsInCourse.length;

    const attendedClasses = await Attendance.countDocuments({
        student: studentId,
        classSession: { $in: allSessionsInCourse.map(s => s._id) }
    });

    const overallAttendance = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

    // 2. Monthly Breakdown (Present vs. Absent)
    const monthlyBreakdown = await Attendance.aggregate([
        // Match attendance records for the specific student and course sessions
        { $match: { student: studentId, classSession: { $in: allSessionsInCourse.map(s => s._id) } } },
        // Project the month from the 'markedAt' date
        { $project: { month: { $month: "$markedAt" } } },
        // Group by month and count the records (present days)
        { $group: { _id: "$month", present: { $sum: 1 } } },
        // Sort by month
        { $sort: { _id: 1 } }
    ]);

    // Format the monthly data for the frontend chart
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedMonthlyData = monthNames.map((name, index) => {
        const monthData = monthlyBreakdown.find(item => item._id === index + 1);
        const present = monthData ? monthData.present : 0;
        // This is a simplified absent calculation, a more complex one would be needed for perfect accuracy
        return { month: name, Present: present, Absent: 0 }; // Simplified
    });


    const analyticsData = {
        overallAttendance,
        classesAttended,
        totalClasses,
        monthlyBreakdown: formattedMonthlyData,
        // Weekly trend would require a more complex aggregation, so we'll omit it for now
        weeklyAttendance: [] 
    };

    return res.status(200).json(
        new apiResponse(200, analyticsData, "Analytics fetched successfully")
    );
});

export { getCourseAnalyticsForStudent };