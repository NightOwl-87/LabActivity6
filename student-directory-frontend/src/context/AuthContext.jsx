import { createContext, useCallback, useState } from 'react';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:3000/api/auth';

// Decode the user information stored inside the JWT
const getUserFromToken = (token) => {
    try {
        const payload = token.split('.')[1];
        const decoded = atob(
            payload.replace(/-/g, '+').replace(/_/g, '/')
        );

        return JSON.parse(decoded);
    } catch {
        return null;
    }
};

export function AuthProvider({ children }) {
    // Check localStorage when the application first loads
    const [token, setToken] = useState(
        () => localStorage.getItem('token')
    );

    const [user, setUser] = useState(() => {
        const savedToken = localStorage.getItem('token');

        return savedToken ? getUserFromToken(savedToken) : null;
    });

    // Login function
    const login = async (email, password) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Invalid credentials');
        }

        // Save the JWT
        localStorage.setItem('token', data.token);

        setToken(data.token);
        setUser(getUserFromToken(data.token));

        return data;
    };

    // Logout function
    const logout = useCallback(() => {
    localStorage.removeItem('token');

    setToken(null);
    setUser(null);
}, []);

    const isAuthenticated = Boolean(token);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
