// controllers/adminController.js
const User = require('../models/User');

// GET all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // exclude password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// POST create a user
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, active } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      role,
      active,
      password: 'Default123!', // ⚠️ change this logic in production (e.g., send password reset email)
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// PUT update a user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, role, active } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.role = role || user.role;
    user.active = typeof active === 'boolean' ? active : user.active;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user' });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
};
