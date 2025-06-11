const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/', authController.restrictTo('admin'), userController.getAllUsers);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);
router.delete('/:id', authController.restrictTo('admin'), userController.deleteUser);
router.patch('/update-me', userController.updateMe);
router.delete('/delete-me', userController.deleteMe);
router.patch('/toggle-mfa', userController.toggleMfa);

module.exports = router;