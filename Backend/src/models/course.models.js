// In src/models/course.models.js

import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
    {
        courseName: {
            type: String,
            required: true,
            trim: true,
        },
        courseCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        faculty: {
            type: Schema.Types.ObjectId,
            ref: "Faculty",
            required: true,
        },
        // --- ADD THIS LOCATION OBJECT ---
        location: {
            latitude: { type: Number },
            longitude: { type: Number }
        }
    },
    { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);