import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types

const notificationSchema = new mongoose.Schema({
    user: {type: ObjectId, ref: "User", required: true},
    type: {type: String, enum: ["booking_created", "booking_booked", "booking_cancelled", "booking_completed", "booking_rejected", "review_received", "review_replied"], required: true},
    title: {type: String, required: true},
    message: {type: String, required: true},
    booking: {type: ObjectId, ref: "Booking"},
    review: {type: ObjectId, ref: "Review"},
    isRead: {type: Boolean, default: false},
    readAt: {type: Date}
},{timestamps: true})

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification
