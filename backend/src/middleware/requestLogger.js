import logger from "../utils/logger.js";

// request logger middleware - logs incoming HTTP requests
export const requestLogger = (req,res,next)=> {
    const start = Date.now();

    // logging incoming req
    logger.request(req);

    // capturing the original end function to log response time
    const originalEnd = res.end;

    res.end = function (...args) {
        const duration = Date.now() - start;
        logger.response(req,res.statusCode, duration);
        originalEnd.apply(res,args);
    };

    next();
}