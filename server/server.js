import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import otpRouter from "./routes/otpRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import { cleanupOldNotifications } from "./controllers/notificationController.js";

// Initialize Express App
const app = express()

// Connect Database
await connectDB()

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res)=> res.send("Server is running"))
app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)
app.use('/api/otp', otpRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/notifications', notificationRouter)

// Cleanup old notifications daily at midnight
setInterval(() => {
    cleanupOldNotifications();
}, 24 * 60 * 60 * 1000); // 24 hours

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))
