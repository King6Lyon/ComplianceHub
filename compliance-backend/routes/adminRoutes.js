// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
} = require('../controllers/adminController');

// Middleware d'authentification/admin si nécessaire
// const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);

module.exports = router;
