import { ApiError } from "../utils/apiError.js";

export const verifyFaculty = (req, res, next) => {
    try {
        if (req.user?.role !== 'faculty') {
            throw new ApiError(403, "Access denied. You must be a faculty member.");
        }
        next();
    } catch (error) {
        throw new ApiError(403, error?.message || "Access denied.");
    }
};