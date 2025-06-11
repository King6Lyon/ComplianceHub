const jwt = require('jsonwebtoken');

exports.setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};