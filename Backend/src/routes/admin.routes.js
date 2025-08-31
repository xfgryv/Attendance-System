import { Router } from 'express';
const router = Router();
// 1. Import loginAdmin
import { approveFacultyId, loginAdmin } from '../controllers/admin.controllers.js';
import { protect } from '../middlewares/auth.middleware.js';

// --- Public Routes ---
router.route("/login").post(loginAdmin); // 2. Add the login route

// --- Protected Routes ---
router.route("/approve-faculty").post(protect, approveFacultyId);

export default router;