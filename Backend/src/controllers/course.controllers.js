import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Course } from "../models/course.models.js";
import { User } from "../models/user.models.js";

const getAllCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({})
        .populate("faculty", "name")
        .select("-students");

    if (!courses) {
        throw new ApiError(500, "Could not fetch courses.");
    }

    return res.status(200).json(
        new apiResponse(200, courses, "Courses fetched successfully.")
    );
});

const createCourse = asyncHandler(async (req, res) => {
    const { courseName, courseCode } = req.body;

    if (!courseName || !courseCode) {
        throw new ApiError(400, "Course name and code are required.");
    }
    const facultyId = req.user._id;
    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
        throw new ApiError(409, "A course with this code already exists."); 
    }
    const course = await Course.create({
        courseName,
        courseCode,
        faculty: facultyId,
        students: [] 
    });
    if (!course) {
        throw new ApiError(500, "Something went wrong while creating the course.");
    }
    const createdCourse = await Course.findById(course._id).populate("faculty", "name");
    return res.status(201).json(
        new apiResponse(201, createdCourse, "Course created successfully.")
    );
});

// --- THIS FUNCTION HAS BEEN UPDATED ---
const enrollStudent = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const course = await Course.findById(courseId);
    const student = await User.findById(studentId);

    if (!course) {
        throw new ApiError(404, "Course not found.");
    }
    if (!student) {
        throw new ApiError(404, "Student not found.");
    }

    // Ensure arrays exist before using them
    if (!course.students) {
        course.students = [];
    }
    if (!student.courses) {
        student.courses = [];
    }

    if (course.students.includes(studentId)) {
        throw new ApiError(400, "You are already enrolled in this course.");
    }

    course.students.push(studentId);
    student.courses.push(courseId); // Add course to student's record

    await course.save({ validateBeforeSave: false });
    await student.save({ validateBeforeSave: false }); // Save the student's record

      // --- ADD THIS TO POPULATE THE RESPONSE ---
    const createdCourse = await Course.findById(course._id).populate("faculty", "name");
    
    return res.status(201).json(
        new apiResponse(201, createdCourse, "Course created successfully.")
    );
});

const setCourseLocation = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
        throw new ApiError(400, "Latitude and longitude are required.");
    }

    const course = await Course.findById(courseId);

    if (!course) {
        throw new ApiError(404, "Course not found.");
    }

    // Security Check: Ensure the logged-in user is the faculty of this course
    if (course.faculty.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access Denied: You are not the faculty for this course.");
    }

    course.location = { latitude, longitude };
    await course.save({ validateBeforeSave: false });

    return res.status(200).json(
        new apiResponse(200, course, "Course location updated successfully.")
    );
});

export { createCourse, enrollStudent, getAllCourses, setCourseLocation };
