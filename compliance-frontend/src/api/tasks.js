import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getTasks = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  
  const response = await axios.get(
    `${API_URL}/tasks?${params.toString()}`
  );
  return response.data.data.tasks;
};

export const getTask = async (id) => {
  const response = await axios.get(`${API_URL}/tasks/${id}`);
  return response.data.data.task;
};

export const createTask = async (taskData) => {
  const response = await axios.post(`${API_URL}/tasks`, taskData);
  return response.data.data.task;
};

export const updateTask = async (id, taskData) => {
  const response = await axios.patch(`${API_URL}/tasks/${id}`, taskData);
  return response.data.data.task;
};

export const updateTaskStatus = async (id, status) => {
  const response = await axios.patch(`${API_URL}/tasks/${id}/status`, { status });
  return response.data.data.task;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/tasks/${id}`);
  return response.data;
};

export const completeTask = async (id) => {
  const response = await axios.patch(`${API_URL}/tasks/${id}/complete`);
  return response.data.data.task;
};

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data.data.users; 
};