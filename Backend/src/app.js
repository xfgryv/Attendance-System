import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express(); // Changed 'let' to 'const'

app.use(express.json({ limit: "10mb" }));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// --- Routes Import ---
import userRoutes from "./routes/user.routes.js";
import facultyRoutes from "./routes/faculty.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import courseRoutes from "./routes/courses.routes.js";
import attendanceRouter from './routes/attendance.routes.js';
import dashboardRoutes from "./routes/dashboard.routes.js"; // <-- 1. ADD THIS LINE
import analyticsRoutes from "./routes/analytics.routes.js"; // 1. Import analytics routes



// --- Routes Declaration ---
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/faculty", facultyRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/attendance", attendanceRouter);
app.use("/api/v1/dashboard", dashboardRoutes); // <-- 2. ADD THIS LINE
app.use("/api/v1/analytics", analyticsRoutes); // 2. Add analytics routes

// Example URL: https://localhost:5000/api/v1/faculty/register

export { app };