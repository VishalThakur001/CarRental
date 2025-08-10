import express from "express";
import { getCars, getUserData, loginUser, registerUser, updateProfileImage, uploadProfileImage } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', protect, getUserData)
userRouter.get('/cars', getCars)
userRouter.post('/update-profile-image', protect, updateProfileImage)
userRouter.post('/upload-profile-image', protect, upload.single('image'), uploadProfileImage)

export default userRouter;
