import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { Faculty } from "../models/faculty.model.js";
import { Admin } from "../models/admin.model.js";

export const protect = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        let user;
        if (decodedToken.userType === 'student') {
            user = await User.findById(decodedToken.id).select("-password");
            // After finding the user, convert it to an object and add the role
            if (user) {
                const userObj = user.toObject();
                userObj.role = 'student';
                user = userObj;
            }
        } else if (decodedToken.userType === 'faculty') {
            user = await Faculty.findById(decodedToken.id).select("-password");
            // After finding the user, convert it to an object and add the role
            if (user) {
                const userObj = user.toObject();
                userObj.role = 'faculty';
                user = userObj;
            }
        } else if (decodedToken.userType === 'admin') {
            user = await Admin.findById(decodedToken.id).select("-password");
             // After finding the user, convert it to an object and add the role
            if (user) {
                const userObj = user.toObject();
                userObj.role = 'admin';
                user = userObj;
            }
        }

        if (!user) {
            throw new ApiError(401, "Invalid Access Token. User not found.");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});