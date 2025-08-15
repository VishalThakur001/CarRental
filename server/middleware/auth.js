import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next)=>{
    let token = req.headers.authorization;

    if(!token){
        return res.json({success: false, message: "not authorized - no token provided"})
    }

    try {
        // Remove 'Bearer ' prefix if present
        if (token.startsWith('Bearer ')) {
            token = token.slice(7);
        }

        // Verify the token (not just decode)
        const userId = jwt.verify(token, process.env.JWT_SECRET)

        if(!userId){
            return res.json({success: false, message: "not authorized - invalid token"})
        }

        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.json({success: false, message: "not authorized - user not found"})
        }

        req.user = user;
        next();
    } catch (error) {
        console.log('Auth error:', error.message);
        return res.json({success: false, message: "not authorized - token verification failed"})
    }
}
