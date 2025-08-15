import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Car from "../models/Car.js";
import OTP from "../models/OTP.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";
import Notification from "../models/Notification.js";


// Generate JWT Token
const generateToken = (userId)=>{
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET)
}

// Register User (after email verification)
export const registerUser = async (req, res)=>{
    try {
        const {name, email, password, verificationToken} = req.body

        if(!name || !email || !password || !verificationToken || password.length < 8){
            return res.json({success: false, message: 'Fill all the fields and verify your email first'})
        }

        // Verify that email was verified with OTP
        const otpRecord = await OTP.findById(verificationToken);
        if (!otpRecord || otpRecord.email !== email || !otpRecord.verified) {
            return res.json({success: false, message: 'Email verification required. Please verify your email first.'})
        }

        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashedPassword})

        // Clean up OTP record after successful registration
        await OTP.findByIdAndDelete(verificationToken);

        const token = generateToken(user._id.toString())
        res.json({success: true, token, message: 'Account created successfully!'})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Login User 
export const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json({success: false, message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: "Invalid Credentials" })
        }
        const token = generateToken(user._id.toString())
        res.json({success: true, token})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get User data using Token (JWT)
export const getUserData = async (req, res) =>{
    try {
        const {user} = req;
        res.json({success: true, user})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get All Cars for the Frontend
export const getCars = async (req, res) =>{
    try {
        const cars = await Car.find({isAvaliable: true})
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Update Profile Image with predefined avatar
export const updateProfileImage = async (req, res) => {
    try {
        const { _id } = req.user;
        const { imageType, imageUrl } = req.body;

        // If removing image, set to empty string
        if (imageType === 'default') {
            await User.findByIdAndUpdate(_id, { image: '' });
            return res.json({ success: true, message: 'Profile photo removed successfully' });
        }

        // If setting predefined avatar
        if (imageType === 'avatar' && imageUrl) {
            await User.findByIdAndUpdate(_id, { image: imageUrl });
            return res.json({ success: true, message: 'Profile photo updated successfully' });
        }

        res.json({ success: false, message: 'Invalid request parameters' });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Upload Profile Image (custom upload)
export const uploadProfileImage = async (req, res) => {
    try {
        const { _id } = req.user;

        if (!req.file) {
            return res.json({ success: false, message: 'No image file provided' });
        }

        // Here you would integrate with your image upload service (ImageKit, Cloudinary, etc.)
        // For now, we'll use a placeholder URL
        const imageUrl = `https://placeholder-for-uploaded-image.com/${req.file.filename}`;

        await User.findByIdAndUpdate(_id, { image: imageUrl });

        res.json({
            success: true,
            message: 'Profile photo uploaded successfully',
            imageUrl
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Change User Password
export const changePassword = async (req, res) => {
    try {
        const { _id } = req.user;
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.json({ success: false, message: 'Both current and new passwords are required' });
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: 'New password must be at least 8 characters long' });
        }

        // Get user with current password
        const user = await User.findById(_id);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.json({ success: false, message: 'Current password is incorrect' });
        }

        // Check if new password is different from current
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.json({ success: false, message: 'New password must be different from current password' });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await User.findByIdAndUpdate(_id, { password: hashedNewPassword });

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: 'An error occurred while changing password. Please try again.' });
    }
}

// Reset Password (with email verification)
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, verificationToken } = req.body;

        // Validate input
        if (!email || !newPassword || !verificationToken) {
            return res.json({ success: false, message: 'All fields are required' });
        }

        if (newPassword.length < 8) {
            return res.json({ success: false, message: 'Password must be at least 8 characters long' });
        }

        // Verify that email was verified with OTP
        const otpRecord = await OTP.findById(verificationToken);
        if (!otpRecord || otpRecord.email !== email || !otpRecord.verified) {
            return res.json({ success: false, message: 'Invalid or expired verification token' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Check if new password is different from current
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.json({ success: false, message: 'New password must be different from current password' });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await User.findByIdAndUpdate(user._id, { password: hashedNewPassword });

        // Clean up OTP record after successful password reset
        await OTP.findByIdAndDelete(verificationToken);

        res.json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: 'An error occurred while resetting password. Please try again.' });
    }
}

// Delete User Account and All Associated Data
export const deleteAccount = async (req, res) => {
    try {
        const { _id } = req.user;
        const { password } = req.body;

        // Verify password before deletion
        const user = await User.findById(_id);
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password. Account deletion failed.' });
        }

        // Check for active bookings (pending, booked, on_rent)
        const activeBookings = await Booking.find({
            $or: [
                { user: _id, status: { $in: ['pending', 'booked', 'on_rent'] } },
                { owner: _id, status: { $in: ['pending', 'booked', 'on_rent'] } }
            ]
        });

        if (activeBookings.length > 0) {
            return res.json({
                success: false,
                message: 'Cannot delete account with active bookings. Please complete or cancel all active bookings first.'
            });
        }

        // Start deletion process - order matters to maintain referential integrity

        // 1. Delete all notifications for this user
        await Notification.deleteMany({ user: _id });

        // 2. Delete all reviews by this user and reviews for their cars
        const userCars = await Car.find({ owner: _id });
        const userCarIds = userCars.map(car => car._id);

        await Review.deleteMany({
            $or: [
                { user: _id }, // Reviews by this user
                { car: { $in: userCarIds } } // Reviews for this user's cars
            ]
        });

        // 3. Delete all completed/cancelled bookings involving this user
        await Booking.deleteMany({
            $or: [
                { user: _id },
                { owner: _id }
            ]
        });

        // 4. Delete all cars owned by this user
        await Car.deleteMany({ owner: _id });

        // 5. Finally, delete the user account
        await User.findByIdAndDelete(_id);

        res.json({
            success: true,
            message: 'Account deleted successfully. All your data has been permanently removed.'
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: 'An error occurred while deleting your account. Please try again.' });
    }
}
