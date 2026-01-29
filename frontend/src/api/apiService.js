import { apiClient } from './apiClient.js';

// AUTHENTICATION & USER SERVICES


export const authService = {
    login: async (email, password) => {
        return apiClient('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    register: async (userData) => {
        return apiClient('/api/users/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    logout: async () => {
        return apiClient('/api/users/logout', { method: 'POST' });
    },

    getProfile: async () => {
        return apiClient('/api/users/me', { method: 'GET' });
    },

    updateProfile: async (userData) => {
        return apiClient('/api/users/me', {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    },
};


// BUSINESS SERVICES

export const businessService = {
    getAll: async (params = {}) => {
        // Convert params object to query string
        const query = new URLSearchParams(params).toString();
        return apiClient(`/api/businesses?${query}`, { method: 'GET' });
    },

    getFeatured: async () => {
        return apiClient(`/api/businesses/featured`, { method: 'GET' });
    },

    getByCategory: async (category, params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiClient(`/api/businesses/category/${category}?${query}`, { method: 'GET' });
    },

    getById: async (id) => {
        return apiClient(`/api/businesses/detail/${id}`, { method: 'GET' });
    },
    search: async (query) => {
        return apiClient(`/api/businesses/search?query=${query}`, { method: 'GET' });
    },

    // Admin only
    create: async (data) => {
        return apiClient('/api/businesses', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    update: async (id, data) => {
        return apiClient(`/api/businesses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    delete: async (id) => {
        return apiClient(`/api/businesses/${id}`, { method: 'DELETE' });
    }
};

// ==========================================
// MENU SERVICES
// ==========================================

export const menuService = {
    getByBusinessId: async (businessId) => {
        return apiClient(`/api/menu/${businessId}`, { method: 'GET' });
    },

    getTopItems: async (businessId) => {
        return apiClient(`/api/menu/${businessId}/top`, { method: 'GET' });
    },

    // Admin only
    create: async (data) => {
        return apiClient('/api/menu', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    update: async (id, data) => {
        return apiClient(`/api/menu/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    delete: async (id) => {
        return apiClient(`/api/menu/${id}`, { method: 'DELETE' });
    }
};

// ==========================================
// REVIEW SERVICES
// ==========================================

export const reviewService = {
    getAll: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiClient(`/api/reviews?${query}`, { method: 'GET' });
    },

    getByBusinessId: async (businessId) => {
        return apiClient(`/api/reviews/${businessId}`, { method: 'GET' });
    },

    getByUserId: async (userId) => {
        return apiClient(`/api/reviews/user/${userId}`, { method: 'GET' });
    },

    create: async (data) => {
        return apiClient('/api/reviews', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (reviewId, data) => {
        return apiClient(`/api/reviews/${reviewId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
};


// ==========================================
// DELIVERY SERVICES
// ==========================================

export const deliveryService = {
    getAllServices: async () => {
        return apiClient('/api/delivery', { method: 'GET' });
    },

    getTopRated: async () => {
        return apiClient('/api/delivery/top', { method: 'GET' });
    },

    getServiceById: async (id) => {
        return apiClient(`/api/delivery/${id}`, { method: 'GET' });
    },

    createRequest: async (data) => {
        return apiClient('/api/delivery', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getMyDeliveries: async () => {
        return apiClient('/api/delivery/me', { method: 'GET' });
    },

    updateStatus: async (id, status) => {
        return apiClient(`/api/delivery/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    },

    cancel: async (id) => {
        return apiClient(`/api/delivery/${id}`, { method: 'DELETE' });
    },
};

// ==========================================
// CHAT SERVICES
// ==========================================

export const chatService = {
    sendMessage: async (message, history = []) => {
        return apiClient('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ message, history }),
        });
    },
};
