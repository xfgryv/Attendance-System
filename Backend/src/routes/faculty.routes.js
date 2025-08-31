import { Router } from 'express';
import { 
    registerFaculty, 
    loginFaculty, 
    logoutFaculty, 
    updateFacultyDetails, 
    getCurrentFaculty 
} from '../controllers/faculty.controllers.js';
import { protect } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middlewares.js'; // 1. ADD THIS IMPORT

const router = Router();

// 2. ADD 'upload.none()' TO THIS ROUTE
router.route("/register").post(upload.none(), registerFaculty); 

router.route("/login").post(loginFaculty);

// --- Protected Routes ---
router.route("/logout").post(protect, logoutFaculty);
router.route("/me").get(protect, getCurrentFaculty);
router.route("/me/update").patch(protect, updateFacultyDetails);

export default router;