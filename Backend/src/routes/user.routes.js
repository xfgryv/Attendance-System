import { Router } from 'express';
const router = Router();
import { registerUser, updateUserDetails, getCurrentUser, loginUser, logOut } from '../controllers/user.controllers.js';
import { protect } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middlewares.js';



router.route("/register").post(upload.single("profileImage"), registerUser);
// Routes for the currently logged-in user
router.route("/me").get(protect, getCurrentUser);
router.route("/me/update").patch(protect, updateUserDetails);
router.route("/login").post(loginUser);
router.route("/logout").post(protect, logOut);

export default router;
