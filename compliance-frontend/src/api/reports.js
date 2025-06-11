import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getReports = async (frameworkId = null) => {
  const url = frameworkId 
    ? `${API_URL}/reports/framework/${frameworkId}`
    : `${API_URL}/reports`;
  
  const response = await axios.get(url);
  return response.data.data.reports;
};

export const getReport = async (id) => {
  const response = await axios.get(`${API_URL}/reports/${id}`);
  return response.data.data.report;
};

export const generateReport = async (frameworkId) => {
  const response = await axios.post(`${API_URL}/reports/framework/${frameworkId}/generate`);
  return response.data.data.report;
};

export const downloadReport = async (id) => {
  const response = await axios.get(`${API_URL}/reports/${id}/download`, {
    responseType: 'blob'
  });
  return response.data;
};

export const deleteReport = async (id) => {
  const response = await axios.delete(`${API_URL}/reports/${id}`);
  return response.data;
};