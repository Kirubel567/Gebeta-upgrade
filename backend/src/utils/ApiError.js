/**
 * Custom Error Class for API
 * Standardizes error structure across the application
 */
class ApiError extends Error {
    
    constructor(
        statusCode, // http status code
        message = "Something went wrong",
        errors = [], // additional error details
        stack = "" // error stack trace
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
