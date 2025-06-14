const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken, generateMfaSecret } = require('../services/mfaService');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    user = new User({
      email,
      password,
      firstName,
      lastName
    });

    // Hash password
   /* const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);*/

    // Generate verification token
    user.verificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Before saving, hashed password:', user.password);

    await user.save();

    // Send verification email
    await sendVerificationEmail(user.email, user.verificationToken);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
        mfaEnabled: user.mfaEnabled
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  console.log('Login attempt with:', req.body);
  const { email, password } = req.body;
  try {
     // Check for user
    const user = await User.findOne({ email }).select('+password');
    console.log('Login credentials:', email, password);
    console.log('User found:', user);
    console.log('User hashed password:', user.password);


    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if email is verified
   /*if (!user.isVerified) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email not verified. Please check your email for verification link.' 
      });
    }*/

    // Generate token
    const token = generateToken(user._id);

    // If MFA is enabled, return partial token and request MFA code
    if (user.mfaEnabled) {
      const partialToken = jwt.sign(
        { userId: user._id, mfaRequired: true },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      );

      return res.status(200).json({
        success: true,
        token: partialToken,
        mfaRequired: true,
        message: 'MFA required. Please enter your authentication code.'
      });
    }

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
        mfaEnabled: user.mfaEnabled
      }
    });
  } catch (err) {
     console.error('Login error:', err);
    next(err);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by email
    const user = await User.findOne({ 
      email: decoded.email,
      verificationToken: token
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Update user
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Email verified successfully. You can now log in.' 
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Save token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    await sendPasswordResetEmail(user.email, resetToken);

    res.status(200).json({ 
      success: true, 
      message: 'Password reset link sent to email' 
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by token
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Password reset successfully' 
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    console.log('Fetching user with ID:', req.user.id); // Log important
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      console.log('No user found for ID:', req.user.id);
      return res.status(404).json({ success: false });
    }

    console.log('User found:', user); // Log de l'utilisateur
    res.status(200).json({
      success: true,
      user // Assurez-vous que c'est bien { user } et pas juste user
    });
  } catch (err) {
    console.error('Error in getMe:', err);
    next(err);
  }
};

// @desc    Setup MFA
// @route   POST /api/auth/setup-mfa
// @access  Private
exports.setupMfa = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.mfaEnabled) {
      return res.status(400).json({ 
        success: false, 
        message: 'MFA is already enabled' 
      });
    }

    // Generate MFA secret
    const { secret, uri } = generateMfaSecret(user.email);

    // Save secret to user (temporarily)
    user.mfaSecret = secret;
    await user.save();

    res.status(200).json({
      success: true,
      secret,
      uri,
      message: 'Scan the QR code with your authenticator app'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify MFA setup
// @route   POST /api/auth/verify-mfa-setup
// @access  Private
exports.verifyMfaSetup = async (req, res, next) => {
  const { code } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user.mfaSecret) {
      return res.status(400).json({ 
        success: false, 
        message: 'MFA setup not initiated' 
      });
    }

    // Verify code
    const verified = verifyMfaCode(user.mfaSecret, code);

    if (!verified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid verification code' 
      });
    }

    // Enable MFA
    user.mfaEnabled = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'MFA enabled successfully'
    });
  } catch (err) {
    next(err);
  }
};

// Middleware to protect routes (JWT verification)
exports.protect = async (req, res, next) => {
  try {
    // 1. Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, no token provided' 
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authorized, user not found' 
      });
    }

    // 4. Attach user to request
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false, 
      message: 'Not authorized, token failed' 
    });
  }
};

// Dans controllers/authController.js
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// @desc    Verify MFA code
// @route   POST /api/auth/verify-mfa
// @access  Public
exports.verifyMfa = async (req, res, next) => {
  const { token, code } = req.body;

  try {
    // Verify partial token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.mfaRequired) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user || !user.mfaEnabled) {
      return res.status(400).json({ 
        success: false, 
        message: 'MFA not enabled for this user' 
      });
    }

    // Verify MFA code
    const verified = verifyMfaCode(user.mfaSecret, code);

    if (!verified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid authentication code' 
      });
    }

    // Generate full token
    const fullToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      token: fullToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
        mfaEnabled: user.mfaEnabled
      }
    });
  } catch (err) {
    next(err);
  }
};