import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiError.js";
import { apiResponse }  from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";


const registerUser = asyncHandler(async (req, res) => {
    const { studentId, name, gmail, password } = req.body;
    
    if ([studentId, name, gmail, password].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ $or: [{ studentId }, { gmail }] });
    if (existedUser) {
        throw new ApiError(409, "User with given Student ID or Gmail already exists");
    }

    const profileImagePath = req.file?.path;
    if(!profileImagePath){
        throw new ApiError(400, "Avatar file is required");
    }
    
    let profileImage = await uploadOnCloudinary(profileImagePath);
    if(!profileImage){
        throw new ApiError(500, "Failed to upload avatar image");
    }

    const student = await User.create({ studentId, name, gmail, password, profileImage: profileImage.url });

    const accessToken = student.generateAccessToken();

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' 
    };

    
    const studentData = student.toObject();
    delete studentData.password;

    
    return res.status(201)
        .cookie("accessToken", accessToken, options)
        .json(new apiResponse(201, { user: studentData }, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { gmail, password } = req.body;

    if (!gmail || !password) {
        throw new ApiError(400, "Student ID and password are required");
    }

    const student = await User.findOne({ gmail });

    if (!student) {
        throw new ApiError(404, "Student with this ID does not exist");
    }

    const isPasswordValid = await student.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid student credentials");
    }

    const accessToken = student.generateAccessToken();

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    const studentData = student.toObject();
    delete studentData.password;

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new apiResponse(
                200, 
                { user: studentData, accessToken }, 
                "User logged in successfully"
            )
        );
});
const logOut = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new apiResponse(200, {}, "Faculty logged out successfully."));

});

const updateUserDetails = asyncHandler(async (req, res) => {
    const { name, gmail } = req.body;

    if (!name && !gmail) {
        throw new ApiError(400, "At least one field (name or gmail) is required to update.");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { name, gmail } },
        { new: true }
    ).select("-password");

    return res.status(200).json(
        new apiResponse(200, updatedUser, "User details updated successfully")
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {

    return res.status(200).json(
        new apiResponse(200, req.user, "Current user fetched successfully")
    );
});

export { registerUser, updateUserDetails, getCurrentUser, loginUser, logOut };