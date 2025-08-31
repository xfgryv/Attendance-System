// src/routes/analytics.routes.js

import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { getCourseAnalyticsForStudent } from '../controllers/analytics.controller.js';

const router = Router();

// All routes in this file require a login
router.use(protect);

router.route("/course/:courseId").get(getCourseAnalyticsForStudent);

export default router;