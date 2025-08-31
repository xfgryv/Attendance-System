import mongoose from "mongoose";

const approvedFacultySchema = new mongoose.Schema({
  teacherId: {
    type: String,
    required: true,
    unique: true,
  },
  isRegistered: {
    type: Boolean,
    default: false, // Tracks if the ID has been used
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', // Assuming you'll have an Admin model
    required: true,
  }
}, { timestamps: true });

const ApprovedFaculty = mongoose.model('ApprovedFaculty', approvedFacultySchema);

export { ApprovedFaculty };