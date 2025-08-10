import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected', ()=> console.log("Database Connected"));
        if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mongodb://localhost:27017/placeholder') {
            await mongoose.connect(`${process.env.MONGODB_URI}/car-rental`)
        } else {
            console.log("Skipping database connection - MONGODB_URI not configured");
        }
    } catch (error) {
        console.log("Database connection error:", error.message);
    }
}

export default connectDB;
