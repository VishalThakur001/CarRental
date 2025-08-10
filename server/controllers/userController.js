import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Car from "../models/Car.js";
import OTP from "../models/OTP.js";


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
