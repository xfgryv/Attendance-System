import mongoose from "mongoose";
import {DB_NAME} from "../constant.js";

const connectDB = async ()=>{
    try{
        let connectionString = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`MongoDB connected !! HOST is ${connectionString.connection.host}`);
    }catch(error){
        console.log("MONGODB CONNECTION ERROR", error);
        process.exit(1);
    }
}

export default connectDB;