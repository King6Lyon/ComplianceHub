import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getControls = async (frameworkId, filters = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.level) params.append('level', filters.level);
  
  try {
    const response = await axios.get(
      `${API_URL}/controls/framework/${frameworkId}?${params.toString()}`
    );
    return response.data.data.controls || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des contrôles:', error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};


export const getControl = async (id) => {
  const response = await axios.get(`${API_URL}/controls/${id}`);
  return response.data.data.control || null;
};

export const getControlCategories = async (frameworkId) => {
  const response = await axios.get(`${API_URL}/controls/framework/${frameworkId}/categories`);
  return response.data.data.categories;
};

export const createControl = async (controlData) => {
  const response = await axios.post(`${API_URL}/controls`, controlData);
  return response.data.data.control;
};

export const updateControl = async (id, controlData) => {
  const response = await axios.patch(`${API_URL}/controls/${id}`, controlData);
  return response.data.data.control;
};

export const deleteControl = async (id) => {
  const response = await axios.delete(`${API_URL}/controls/${id}`);
  return response.data;
};