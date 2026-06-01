import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, getCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  // Rehydrate session on app load, then verify token is still valid with /me
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser  = localStorage.getItem('user');

    if (!storedToken || !storedUser) {
      setReady(true);
      return;
    }

    setToken(storedToken);
    setUser(JSON.parse(storedUser));

    getCurrentUser()
      .then((data) => {
        // Sync user state with latest profile from server
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      })
      .catch(() => {
        // Token expired or invalid — 401 interceptor handles redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const data = await loginUser({ email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
    } catch (err) {
      const message = err.response?.data?.message ?? err.message ?? 'Invalid email or password.';
      throw new Error(message);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      await registerUser({ name, email, password });
      navigate('/login', { state: { message: 'Account created! Please sign in.' } });
    } catch (err) {
      const message = err.response?.data?.message ?? err.message ?? 'Registration failed. Please try again.';
      throw new Error(message);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
