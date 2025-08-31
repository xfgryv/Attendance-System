import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    classSession: {
        type: Schema.Types.ObjectId,
        ref: "ClassSession",
        required: true
    },
    markedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Ensures a student can only be marked present once per class
attendanceSchema.index({ student: 1, classSession: 1 }, { unique: true });

export const Attendance = mongoose.model("Attendance", attendanceSchema);