import { ApiError } from "../utils/ApiError.js";

/**
 * JSON Body Parser Middleware
 * Parses JSON request bodies with size limit enforcement
 * Returns a Promise that resolves when parsing is complete (for async middleware runners)
 */
export const jsonBodyParser = (req, res, next) => {
    return new Promise((resolve, reject) => {
        // Skip strictly if method has no body semantics
        if (["GET", "DELETE", "OPTIONS", "HEAD"].includes(req.method)) {
            next();
            resolve();
            return;
        }

        //  Check Content-Type (must be application/json)
        const contentType = req.headers["content-type"];
        if (!contentType || !contentType.includes("application/json")) {
            // Not JSON, just skip
            next();
            resolve();
            return;
        }

        // Size Limit Configuration
        const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1MB limit
        let totalSize = 0;
        let bodyChunks = [];

        // Read the stream
        req.on("data", (chunk) => {
            totalSize += chunk.length;

            if (totalSize > MAX_SIZE_BYTES) {
                req.destroy();
                
            }
            bodyChunks.push(chunk);
        });

        req.on("end", () => {
            if (totalSize > MAX_SIZE_BYTES) {
                const err = new ApiError(413, "Payload Too Large");
                next(err);
                reject(err);
                return;
            }

            try {
                const bodyString = Buffer.concat(bodyChunks).toString();
                if (!bodyString) {
                    req.body = {};
                    next();
                    resolve();
                    return;
                }
                req.body = JSON.parse(bodyString);
                next();
                resolve();
            } catch (err) {
                const apiError = new ApiError(400, "Invalid JSON format", [err.message]);
                next(apiError); 
                reject(apiError);
            }
        });

        req.on("error", (err) => {
            const apiError = new ApiError(400, "Stream Error", [err.message]);
            reject(apiError);
        });
    });
};
