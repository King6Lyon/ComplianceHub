import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getFrameworks = async () => {
  try {
    const response = await axios.get(`${API_URL}/frameworks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching frameworks:', error);
    throw error;
  }
};

export const getFrameworkControls = async (frameworkId) => {
  try {
    const response = await axios.get(`${API_URL}/frameworks/${frameworkId}/controls`);
    return response.data;
  } catch (error) {
    console.error('Error fetching framework controls:', error);
    throw error;
  }
};

export const getFrameworkProgress = async (frameworkId) => {
  try {
    const response = await axios.get(`${API_URL}/frameworks/${frameworkId}/progress`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch framework progress');
  }
};

export const getControlDetails = async (controlId) => {
  try {
    const response = await axios.get(`${API_URL}/controls/${controlId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching control details:', error);
    throw error;
  }
};

export const updateControlStatus = async (controlId, status) => {
  try {
    const response = await axios.put(`${API_URL}/controls/${controlId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating control status:', error);
    throw error;
  }
};