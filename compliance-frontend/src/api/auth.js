import axios from 'axios';
import { setAuthToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configuration globale d'axios
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Helper pour la gestion standardisée des erreurs
const handleApiError = (error) => {
  const errorMessage = error.response?.data?.message || 
                      error.message || 
                      'Une erreur est survenue';
  throw new Error(errorMessage);
};

export const register = async (userData) => {
  try {
    console.log("Sending registration request:", userData);
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error);
    throw error; // Laisse passer l'erreur originale
  }
};

//login pour stocker le token
export const login = async (credentials) => {
  try {
    await axios.post(`${API_URL}/auth/login`, credentials).then((response)=>{
      console.log('Login API response:', response.data);
    
    if (!response.data.token) {
      throw new Error('Authentication failed - no token received');
    }
    
    return {
      success: true,
      token: response.data.token,
      user: response.data.user,
      mfaRequired: response.data.mfaRequired || false
    };
    });
  } catch (error) {
    console.error('Login API error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    console.error("Login error in component:", error.message);
    throw error;
  }
};

export const verifyMfa = async (token, code) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-mfa`, { token, code });
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`);
    console.log('Current user response:', response.data);
    return response.data.user || response.data;
  } catch (error) {
    console.error('Error fetching current user:', error.response || error);
    throw error;
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/auth/verify/${token}`);
    console.log('Email verification response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Email verification failed:', error.response?.data || error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await axios.put(`${API_URL}/auth/reset-password/${token}`, { password });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const setupMfa = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/setup-mfa`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const verifyMfaSetup = async (code) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-mfa-setup`, { code });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const logout = async () => {
  try {
    setAuthToken(null);
    await axios.post(`${API_URL}/auth/logout`);
  } catch (error) {
    // Ne pas bloquer si le logout échoue
    console.error('Logout error:', error);
    throw error;
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/auth/profile`, userData);
    return response.data.user;
  } catch (error) {
    return handleApiError(error);
  }
};

// Alias pour compatibilité
export const getMe = getCurrentUser;