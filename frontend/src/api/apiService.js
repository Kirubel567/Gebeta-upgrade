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

    // Get current user's business (single - legacy)
    getMyBusiness: async () => {
        return apiClient('/api/businesses/my-business', { method: 'GET' });
    },

    // Get all businesses owned by current user
    getMyBusinesses: async () => {
        return apiClient('/api/businesses/my-businesses', { method: 'GET' });
    },

    // Create business (JSON with Base64 image)
    create: async (data) => {
        return apiClient('/api/businesses', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // Update business (JSON with Base64 image)
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
    getById: async (id) => {
        return apiClient(`/api/menu/item/${id}`, { method: 'GET' });
    },

    getByBusinessId: async (businessId) => {
        return apiClient(`/api/menu/${businessId}`, { method: 'GET' });
    },

    getTopItems: async (businessId) => {
        return apiClient(`/api/menu/${businessId}/top`, { method: 'GET' });
    },

    // Business owner only of its own menu of its business
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


// Applications service
export const applicationService = {
    // Submit new application
    submit: async (data) => {
        return apiClient('/api/applications', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // Get my applications
    getMyApplications: async () => {
        return apiClient('/api/applications/my-applications', { method: 'GET' });
    },

    // Update application (status: pending/rejected)
    update: async (id, data) => {
        return apiClient(`/api/applications/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }
};

// admin services 
export const adminService = {
    // Approve a business
    approveBusiness: async (id) => {
        return apiClient(`/api/businesses/${id}/approve`, {
            method: 'PATCH',
        });
    },

    // Make user an admin
    makeAdmin: async (userId) => {
        return apiClient('/api/admin/make-admin', {
            method: 'POST',
            body: JSON.stringify({ userId }),
        });
    },

    //  Application Management (Admin) 

    // List all applications (optional status filter: 'pending', 'approved', 'rejected')
    listApplications: async (status) => {
        const query = status ? `?status=${status}` : '';
        return apiClient(`/api/applications${query}`, { method: 'GET' });
    },

    // Approve application (creates business)
    approveApplication: async (id, reviewNotes = '', businessData = {}) => {
        return apiClient(`/api/applications/${id}/approve`, {
            method: 'PUT',
            body: JSON.stringify({ reviewNotes, businessData }),
        });
    },

    // Reject application
    rejectApplication: async (id, reviewNotes = '') => {
        return apiClient(`/api/applications/${id}/reject`, {
            method: 'PUT',
            body: JSON.stringify({ reviewNotes }),
        });
    },
};
