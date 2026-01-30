import { ApiError } from "../utils/ApiError.js";

// cors middleware - restricing access to allowed origin

const allowedOrigins = [ "http://localhost:3000", "http://localhost:5174","http://localhost:5173"]; // to be added - todo

export const corsMiddleware = (req,res, next) => {
    const origin = req.headers.origin;
    // allowing requests with no origin
    if(!origin){
        return next();
    }

    if(allowedOrigins.includes(origin)){
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Credentials", "true");

        //handling preflight requests
        if(req.method === "OPTIONS"){
            res.writeHead(204);
            res.end();
            return; 
        }
    }else{
        const error = new ApiError(403, "Forbidden", ["Origin not allowed"]);
        return next(error);
    }

    next();
}