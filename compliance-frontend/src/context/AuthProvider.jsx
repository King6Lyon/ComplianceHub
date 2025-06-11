import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login, logout as apiLogout, getCurrentUser } from '../api/auth';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const loadUser = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        // Configure axios pour toutes les requêtes
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const userData = await getCurrentUser();
        console.log('User data loaded:', userData);
        
        if (!userData?._id && !userData?.user?._id) {
          throw new Error('Invalid user data');
        }

        setUser(userData.user || userData);
      } catch (err) {
        console.error('Failed to load user:', err);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const loginUser = async (email, password, mfaCode) => {
    setLoading(true);
    try {
      const response = await login({ email, password, mfaCode });
      console.log('Login response:', response);

      if (!response?.token) {
        throw new Error('No token received');
      }

      localStorage.setItem('token', response.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
      
      const userData = response.user || await getCurrentUser();
      setUser(userData);
      
      navigate('/');
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      console.error('Login error:', errorMsg);
      setError(errorMsg);

      if (errorMsg.includes('verified')) {
        navigate('/verify-email', { state: { email } });
      }
      
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      navigate('/auth?mode=login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginUser,
        logout,
        loading,
        error,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};