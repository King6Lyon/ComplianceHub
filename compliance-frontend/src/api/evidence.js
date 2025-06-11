import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getEvidence = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.controlId) params.append('controlId', filters.controlId);
  if (filters.frameworkId) params.append('frameworkId', filters.frameworkId);
  
  const response = await axios.get(
    `${API_URL}/evidence?${params.toString()}`
  );
  return response.data.data.evidence;
};

export const getSingleEvidence = async (id) => {
  const response = await axios.get(`${API_URL}/evidence/${id}`);
  return response.data.data.evidence;
};

export const createEvidence = async (evidenceData) => {
  const response = await axios.post(`${API_URL}/evidence`, evidenceData);
  return response.data.data.evidence;
};

export const updateEvidence = async (id, evidenceData) => {
  const response = await axios.patch(`${API_URL}/evidence/${id}`, evidenceData);
  return response.data.data.evidence;
};

export const deleteEvidence = async (id) => {
  const response = await axios.delete(`${API_URL}/evidence/${id}`);
  return response.data;
};

export const uploadEvidenceFiles = async (id, files) => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  
  const response = await axios.post(
    `${API_URL}/evidence/${id}/files`, 
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data.data.files;
};

export const deleteEvidenceFile = async (evidenceId, fileId) => {
  const response = await axios.delete(`${API_URL}/evidence/${evidenceId}/files/${fileId}`);
  return response.data;
};