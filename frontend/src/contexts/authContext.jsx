import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem('gebeta_token');
        const savedUser = localStorage.getItem('gebeta_user');
        
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await authService.login(email, password);
        const { token, user: userData } = response.data;

        localStorage.setItem('gebeta_token', token);
        localStorage.setItem('gebeta_user', JSON.stringify(userData));
        setUser(userData);
        return response;
    };

    const logout = () => {
        localStorage.removeItem('gebeta_token');
        localStorage.removeItem('gebeta_user');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);