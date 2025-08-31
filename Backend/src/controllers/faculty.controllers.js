import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";
import { Faculty } from "../models/faculty.model.js";
import { ApprovedFaculty } from "../models/approvedFaculty.model.js";

const registerFaculty = asyncHandler(async (req, res) => {
    const { teacherId, name, gmail, password } = req.body;

    if ([teacherId, name, gmail, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const approvedEntry = await ApprovedFaculty.findOne({ teacherId });
    if (!approvedEntry) {
        throw new ApiError(403, "This Teacher ID has not been approved for registration.");
    }
    if (approvedEntry.isRegistered) {
        throw new ApiError(409, "This Teacher ID has already been used to register an account.");
    }

    const existedFaculty = await Faculty.findOne({ $or: [{ teacherId }, { gmail }] });
    if (existedFaculty) {
        throw new ApiError(409, "Faculty with given Teacher ID or Gmail already exists");
    }

    const faculty = await Faculty.create({ teacherId, name, gmail, password });
    
    // Mark the ID as registered
    approvedEntry.isRegistered = true;
    await approvedEntry.save();

    const facultyData = faculty.toObject();
    delete facultyData.password;

    // After registering, we log them in immediately by generating a token and setting the cookie.
    const accessToken = faculty.generateAccessToken();
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .json(new apiResponse(201, { user: facultyData, accessToken }, "Faculty registered successfully"));
});

// --- NEW LOGIN FUNCTION ---
const loginFaculty = asyncHandler(async (req, res) => {
    const { gmail, password } = req.body;

    if (!gmail || !password) {
        throw new ApiError(400, "Gmail and password are required.");
    }

    const faculty = await Faculty.findOne({ gmail });
    if (!faculty) {
        throw new ApiError(404, "Faculty with this gmail does not exist.");
    }

    const isPasswordValid = await faculty.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid faculty credentials.");
    }

    const accessToken = faculty.generateAccessToken();
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    const facultyData = faculty.toObject();
    delete facultyData.password;

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new apiResponse(
                200,
                { user: facultyData, accessToken },
                "Faculty logged in successfully."
            )
        );
});

// --- NEW LOGOUT FUNCTION ---
const logoutFaculty = asyncHandler(async (req, res) => {
    // To log out, we just clear the accessToken cookie from the browser
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new apiResponse(200, {}, "Faculty logged out successfully."));
});


const updateFacultyDetails = asyncHandler(async (req, res) => {
    const { name, gmail } = req.body;

    if (!name && !gmail) {
        throw new ApiError(400, "At least one field (name or gmail) is required to update.");
    }

    const updatedFaculty = await Faculty.findByIdAndUpdate(
        req.user._id,
        { $set: { name, gmail } },
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new apiResponse(200, updatedFaculty, "Faculty details updated successfully")
    );
});

const getCurrentFaculty = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new apiResponse(200, req.user, "Current faculty fetched successfully")
    );
});

export { 
    registerFaculty, 
    loginFaculty, 
    logoutFaculty,
    updateFacultyDetails, 
    getCurrentFaculty 
};
