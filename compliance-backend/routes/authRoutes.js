const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const { upload } = require('../config/multer');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify/:token', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password/:token', authController.resetPassword);
router.get('/me', authController.protect, authController.getMe);
router.post('/setup-mfa', authController.protect, authController.setupMfa);
router.post('/verify-mfa-setup', authController.protect, authController.verifyMfaSetup);
router.post('/verify-mfa', authController.verifyMfa);
// Google Auth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google', {
  session: false,
  failureRedirect: `${process.env.CLIENT_URL}/login`
}), authController.googleAuthCallback);

module.exports = router;