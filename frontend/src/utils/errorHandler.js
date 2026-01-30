export class ApiError extends Error {
    constructor(statusCode, message, details = []) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}

export const handleApiError = (error, setError) => {
    if (error.statusCode === 401) {
        // Redirect to login handled by client or component
        localStorage.removeItem('gebeta_token');
        // We avoid window.location.reload() here to let the component handle redirection if needed
        // or rely on the apiClient throwing to a redirect logic
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    } else if (error.statusCode === 403) {
        setError('You do not have permission to perform this action.');
    } else if (error.statusCode === 404) {
        setError('The requested resource was not found.');
    } else if (error.statusCode >= 500) {
        setError('Server error. Please try again later.');
    } else {
        setError(error.message || 'An unexpected error occurred.');
    }
};