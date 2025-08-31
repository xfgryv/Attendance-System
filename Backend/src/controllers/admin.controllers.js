import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { ApprovedFaculty } from "../models/approvedFaculty.model.js";
import { Admin } from "../models/admin.model.js"; // 1. Import the Admin model

// This function is new
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required.");
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
        throw new ApiError(404, "Admin with this email does not exist.");
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid admin credentials.");
    }

    const accessToken = admin.generateAccessToken();
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    const adminData = admin.toObject();
    delete adminData.password;

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new apiResponse(
                200,
                { user: adminData, accessToken },
                "Admin logged in successfully."
            )
        );
});

const approveFacultyId = asyncHandler(async (req, res) => {
    // ... your existing approveFacultyId function ...
    const { teacherId } = req.body;

    if (!teacherId) {
        throw new ApiError(400, "Teacher ID is required.");
    }

    const existingId = await ApprovedFaculty.findOne({ teacherId });
    if (existingId) {
        throw new ApiError(409, "This Teacher ID is already on the approved list.");
    }

    await ApprovedFaculty.create({ teacherId, approvedBy: req.user._id });

    return res.status(201).json(
        new apiResponse(201, {}, `Teacher ID ${teacherId} has been approved for registration.`)
    );
});

// 2. Add loginAdmin to the exports
export { approveFacultyId, loginAdmin };