import dotenv from "dotenv";
import connectDB from "./db/index.db.js";
import { app } from "./app.js";


console.log("My Access Token Secret:", process.env.ACCESS_TOKEN_SECRET);

dotenv.config({
    path: "./.env"
});

connectDB()
.then(() =>{
    app.on("error", (err) => {
        console.error("Server error:", err)
        throw err;
    });
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
});