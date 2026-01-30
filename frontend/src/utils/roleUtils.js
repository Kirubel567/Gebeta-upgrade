// Utility functions for formatting and mapping user roles


// Maps backend role values to user-friendly display strings

export const formatRole = (role) => {
    const roleMap = {
        business_owner: 'Business Owner',
        admin: 'Admin',
        user: 'User',
        moderator: 'Moderator',
        super_admin: 'Super Admin',
    };

    return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
};

// Gets the CSS class for role badge styling
export const getRoleBadgeClass = (role) => {
    const classMap = {
        business_owner: 'role-business-owner',
        admin: 'role-admin',
        user: 'role-user',
        moderator: 'role-moderator',
        super_admin: 'role-super-admin',
    };

    return classMap[role] || 'role-default';
};

// Checks if a role has specific permissions
export const hasPermission = (role, permission) => {
    const permissions = {
        super_admin: ['all'],
        admin: ['approve_business', 'manage_users', 'delete_reviews'],
        moderator: ['approve_business', 'delete_reviews'],
        business_owner: ['manage_own_business', 'respond_to_reviews'],
        user: ['create_review', 'edit_own_review'],
    };

    const rolePermissions = permissions[role] || [];
    return rolePermissions.includes('all') || rolePermissions.includes(permission);
};

export default {
    formatRole,
    getRoleBadgeClass,
    hasPermission,
};
