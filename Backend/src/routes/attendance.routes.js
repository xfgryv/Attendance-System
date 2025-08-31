import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { verifyFaculty } from "../middlewares/role.middleware.js";
import { generateAttendanceQR, markAttendanceViaQR } from "../controllers/attendance.controllers.js";

const router = Router();

// Protect all routes in this file
router.use(protect);

// This route now expects a courseId in the body
router.route("/generate-qr").post(verifyFaculty, generateAttendanceQR);

// This route is for students to mark attendance (no changes needed here)
router.route("/mark/:token").get(markAttendanceViaQR);

export default router;