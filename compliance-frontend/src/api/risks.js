import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getRiskAssessments = async (frameworkId = null) => {
  const url = frameworkId 
    ? `${API_URL}/risks/framework/${frameworkId}`
    : `${API_URL}/risks`;
  
  const response = await axios.get(url);
  return response.data.data.riskAssessments;
};

export const getRiskAssessment = async (id) => {
  const response = await axios.get(`${API_URL}/risks/${id}`);
  return response.data.data.riskAssessment;
};

export const createRiskAssessment = async (riskAssessmentData) => {
  const response = await axios.post(`${API_URL}/risks`, riskAssessmentData);
  return response.data.data.riskAssessment;
};

export const updateRiskAssessment = async (id, riskAssessmentData) => {
  const response = await axios.patch(`${API_URL}/risks/${id}`, riskAssessmentData);
  return response.data.data.riskAssessment;
};

export const deleteRiskAssessment = async (id) => {
  const response = await axios.delete(`${API_URL}/risks/${id}`);
  return response.data;
};

export const createRisk = async (riskData) => {
  const response = await axios.post(`${API_URL}/risks/items`, riskData);
  return response.data.data.risk;
};

export const getRisks = async () => {
  const response = await axios.get(`${API_URL}/risks/items`);
  return response.data.data.risks; // ou response.data.risks selon votre API
};

export const addRisk = async (assessmentId, riskData) => {
  const response = await axios.post(`${API_URL}/risks/${assessmentId}/risks`, riskData);
  return response.data.data.riskAssessment;
};

export const updateRisk = async (assessmentId, riskId, riskData) => {
  const response = await axios.patch(
    `${API_URL}/risks/${assessmentId}/risks/${riskId}`,
    riskData
  );
  return response.data.data.riskAssessment;
};

export const deleteRisk = async (assessmentId, riskId) => {
  const response = await axios.delete(`${API_URL}/risks/${assessmentId}/risks/${riskId}`);
  return response.data;
};