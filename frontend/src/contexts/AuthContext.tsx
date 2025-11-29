import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

interface User {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/api/auth/me/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(response.data);
        } catch (error) {
            // Token is invalid or expired
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        const response = await axios.post('http://localhost:8000/api/auth/login/', {
            username,
            password,
        });

        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

        await checkAuth();
    };

    const logout = async () => {
        const refresh = localStorage.getItem('refresh_token');

        try {
            if (refresh) {
                await axios.post('http://localhost:8000/api/auth/logout/',
                    { refresh },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                        },
                    }
                );
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
        }
    };

    const register = async (data: RegisterData) => {
        const response = await axios.post('http://localhost:8000/api/auth/register/', data);

        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

        await checkAuth();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                register,
                isAuthenticated: !!user,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
