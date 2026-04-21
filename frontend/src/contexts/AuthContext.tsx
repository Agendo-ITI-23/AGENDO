import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

export type Role = 'admin' | 'business_owner' | 'customer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  business_name?: string;
  business_description?: string;
  phone?: string;
  address?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'business_owner' | 'customer';
  business_name?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await axios.get('/api/auth/user');
      setUser(response.data.data.user);
    } catch {
      setToken(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const saveSession = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };

  const login = async (email: string, password: string): Promise<User> => {
    const response = await axios.post('/api/auth/login', { email, password });
    const { user: userData, token: authToken } = response.data.data;
    saveSession(userData, authToken);
    return userData;
  };

  const register = async (data: RegisterData): Promise<User> => {
    const response = await axios.post('/api/auth/register', data);
    const { user: userData, token: authToken } = response.data.data;
    saveSession(userData, authToken);
    return userData;
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch {
      // token ya expirado, ignorar error
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export function getRoleDashboard(role: Role): string {
  if (role === 'admin') return '/dashboard';
  if (role === 'business_owner') return '/owner/dashboard';
  return '/client/dashboard';
}
