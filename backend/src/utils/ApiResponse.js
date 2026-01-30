// Standard API Response Wrapper - Ensures consistent response format for all successful requests

class ApiResponse {

    constructor(statusCode, data, message = "Success", metadata = {}) {
        this.statusCode = statusCode;
        this.data = data; // response payload
        this.message = message; // success message
        this.success = statusCode < 400;

        // Spread any additional metadata (e.g., pagination)
        Object.assign(this, metadata);
    }
}

export { ApiResponse };
