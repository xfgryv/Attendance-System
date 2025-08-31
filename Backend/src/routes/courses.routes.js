import { Router } from 'express';
// UPDATE THE IMPORT
import { createCourse, enrollStudent, getAllCourses, setCourseLocation } from '../controllers/course.controllers.js';
import { protect } from '../middlewares/auth.middleware.js';
import { verifyFaculty } from '../middlewares/role.middleware.js';

const router = Router();

// This makes all routes in this file protected, requiring login
router.use(protect);

// Route for faculty to create a course and for students to get all courses
router.route("/")
    .post(verifyFaculty, createCourse)
    .get(getAllCourses); // <-- ADD THIS

// Route for a student to enroll in a specific course
router.route("/:courseId/enroll")
    .post(enrollStudent);

// --- ADD THIS NEW ROUTE ---
router.route("/:courseId/location")
    .patch(verifyFaculty, setCourseLocation);


export default router;