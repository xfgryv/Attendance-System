import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { getStudentDashboard, getFacultyDashboard } from "../controllers/dashboard.controller.js";

const router = Router();

// The student route is already correct
router.route("/student").get(protect, getStudentDashboard);

// ADD 'protect' to the faculty route
router.route("/faculty").get(protect, getFacultyDashboard);

export default router;