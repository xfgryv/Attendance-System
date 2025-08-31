import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 


const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  gmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: null,
    required: true
  },
  // --- ADD THIS FIELD ---
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  // --------------------
  role: {
        type: String,
        enum: ['student', 'faculty'],
        default: 'student'
    },
    refreshToken: { type: String }  
}, { timestamps: true });

// Hash password before saving
studentSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password for login
studentSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate JWT Access Token
studentSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    {
      id: this._id,
      userType: 'student'
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
    }
  );
};

studentSchema.plugin(mongooseAggregatePaginate);

const User = mongoose.model('User', studentSchema);

export { User };