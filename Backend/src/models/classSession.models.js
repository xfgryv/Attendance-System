import mongoose, { Schema } from "mongoose";

const classSessionSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    classDate: { type: Date, required: true }, // Date of the class session
    startTime: { type: String, required: true }, // e.g., "09:00 AM"
    endTime: { type: String, required: true }, // e.g., "10:00 AM"
    classType: {
        type: String,
        enum: ['online', 'offline'],
        required: true
    },
    // This will store the token for QR code verification
    qrToken: { type: String },
    qrTokenExpires: { type: Date }
}, { timestamps: true });

export const ClassSession = mongoose.model("ClassSession", classSessionSchema);