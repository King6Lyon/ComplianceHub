// Format date to readable string
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Capitalize first letter of a string
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Convert snake_case to Title Case
export const snakeToTitle = (str) => {
  return str.split('_').map(capitalize).join(' ');
};

// Get risk level based on likelihood and impact
export const getRiskLevel = (likelihood, impact) => {
  const levels = {
    low: { low: 'low', medium: 'low', high: 'medium' },
    medium: { low: 'low', medium: 'medium', high: 'high' },
    high: { low: 'medium', medium: 'high', high: 'high' }
  };
  return levels[likelihood][impact];
};

// Debounce function for limiting rapid API calls
export const debounce = (func, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Validate email format
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Generate a unique ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Format bytes to human-readable size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};