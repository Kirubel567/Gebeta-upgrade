import { ApiError } from "../utils/ApiError.js";


export const jsonBodyParser = async (req, res, next) => {
    //  Skip strictly if method has no body semantics
    if (["GET", "DELETE", "OPTIONS", "HEAD"].includes(req.method)) {
        return next();
    }

    //  Check Content-Type (must be application/json)
    const contentType = req.headers["content-type"];
    if (!contentType || !contentType.includes("application/json")) {
        return next();
    }

    //  Size Limit Configuration
    const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1MB limit
    let totalSize = 0;
    let bodyChunks = [];

    // Read the stream
    req.on("data", (chunk) => {
        totalSize += chunk.length;

        if (totalSize > MAX_SIZE_BYTES) {
            req.destroy(); // Close stream

        }
        bodyChunks.push(chunk);
    });

    req.on("end", () => {
        if (totalSize > MAX_SIZE_BYTES) {
            return next(new ApiError(413, "Payload Too Large"));
        }

        try {
            const bodyString = Buffer.concat(bodyChunks).toString();
            if (!bodyString) {
                req.body = {};
                return next();
            }
            req.body = JSON.parse(bodyString);
            next();
        } catch (err) {
            next(new ApiError(400, "Invalid JSON format", [err.message]));
        }
    });

    req.on("error", (err) => {
        next(new ApiError(400, "Stream Error", [err.message]));
    });
};
