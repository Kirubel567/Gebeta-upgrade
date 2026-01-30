import { ApiError } from "../utils/errorHandler.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

export const apiClient = async (endpoint, options = {}) => {
    const token = localStorage.getItem('gebeta_token');

    // Ensure endpoint has a leading slash to avoid URL breakage
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const config = {
        ...options,
        headers: {
            ...options.headers,
        },
    };

    // Only set Content-Type if not FormData (browser will set it automatically for FormData)
    if (!(options.body instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
    }

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${BACKEND_URL}${cleanEndpoint}`, config);

        // Always attempt to parse JSON to get backend error details
        const data = await response.json().catch(() => ({}));

        // Handle 401 Unauthorized globally
        if (response.status === 401) {
            localStorage.removeItem('gebeta_token');
            localStorage.removeItem('gebeta_user');

            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
            // Use backend message if it exists, otherwise fallback
            throw new ApiError(401, data.error?.message || data.message || 'Session expired. Please login again.');
        }

        //  Handle other errors using the standardized format from your guide
        if (!response.ok || !data.success) {
            throw new ApiError(
                response.status,
                data.error?.message || data.message || 'Request failed',
                data.error?.details || []
            );
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) throw error;

        // Handle cases where the server is down (Network Error)
        throw new ApiError(0, 'Network error. Please check if the Gebeta backend is running on port 5000.');
    }
};