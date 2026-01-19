import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";

/**
 * Middleware Runner to execute a chain of middleware functions
 */
export const runMiddleware = async (req, res, middlewares) => {
    for (const mw of middlewares) {
        let nextCalled = false;

        // Create a next() function for each middleware
        const next = () => {
            nextCalled = true;
        };

        try {
            // Execute the middleware
            await mw(req, res, next);

            // If a middleware didn't call next(), it means it handled the response
            // or wants to stop the chain. So we return false.
            if (!nextCalled) return false;
        } catch (err) {
            // If any middleware throws an error, catch it
            errorHandler(err, req, res);
            return false;
        }
    }
    return true; // All middleware passed successfully
};

/**
 * Global Error Handler
 * Centralizes error logging and response formatting
 */
export const errorHandler = (err, req, res) => {
    // Log the error using our new Logger
    logger.error(err.message || 'Internal Server Error', err);

    // Normalize the error
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || error instanceof SyntaxError ? 400 : 500;
        const message = error.message || "Internal Server Error";
        error = new ApiError(statusCode, message, error?.errors || [], error.stack);
    }

    // Construct response object
    const response = {
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        ...(error.errors?.length > 0 && { errors: error.errors }),
        // Only show stack trace in development
        ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
    };

    // Send response if not already sent
    if (!res.headersSent) {
        res.writeHead(error.statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify(response));
    }
};


// Async Handler Wrapper
// Wraps async route handlers to catch errors automatically

export const asyncHandler = (fn) => async (req, res) => {
    try {
        await fn(req, res);
    } catch (err) {
        errorHandler(err, req, res);
    }
};
