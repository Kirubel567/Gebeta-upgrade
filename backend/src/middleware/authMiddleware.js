import {ApiError} from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.js";
import { User } from "../models/User.js";

export const authMiddleware = async (req,res, next) => {
    try {
        // getting token
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }
        if(!token){
            return next(new ApiError(401, "Not authorized to access this resource", ["No token provided"]));
        }

        // verify token
        const decoded = await verifyToken(token);
        console.log("DECODED TOKEN(I just put this to see the bug):", decoded); // SEE WHAT KEYS ARE HERE
        const user = await User.findById(decoded.id || decoded.userId|| decoded._id)

        if(!user){
            return next(new ApiError(401, "Not authorized to access this resource", ["User not found"]));
        }
        //checking the user is active or not
        if(user.isActive === false){
            return next(new ApiError(401, "Not authorized to access this resource", ["Account is disabled"]));
        }

        
        req.user = user;
        next();
    } catch (error) {
        if(error.name === "JsonWebTokenError"){
            return next(new ApiError(401, "Invalid token"));
        }
        if(error.name === "TokenExpiredError"){
            return next(new ApiError(401, "Token expired"));
        }
        next(new ApiError(500, "Auth Error", [error.message]))
    }
}

// role-based auth
export const authorize = (...roles) => {
    return (req,res,next) => {
        if(!req.user || !roles.includes(req.user.role)){
            return next(new ApiError(401, "Not authorized to access this resource", ["Unauthorized"]))
        }
        next();
    }
}