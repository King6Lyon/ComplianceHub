const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Veuillez fournir un email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Veuillez fournir un email valide']
  },
  password: {
    type: String,
    required: [true, 'Veuillez fournir un mot de passe'],
    minlength: 8,
    select: false
  },
  firstName: {
    type: String,
    required: [true, 'Veuillez fournir un prénom']
  },
  lastName: {
    type: String,
    required: [true, 'Veuillez fournir un nom']
  },
  role: {
    type: String,
    enum: ['user', 'compliance_manager', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  mfaEnabled: {
    type: Boolean,
    default: false
  },
  mfaSecret: String,
  frameworks: [{
    frameworkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Framework'
    },
    progress: {
      type: Number,
      default: 0
    },
    lastUpdated: Date
  }],
  active: {
    type: Boolean,
    default: true,
    select: false
  }
}, {
  timestamps: true
});

// Middleware de pré-sauvegarde pour hacher le mot de passe
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// Méthode pour vérifier si le mot de passe est correct
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Méthode pour vérifier si le mot de passe a été changé après l'émission du token
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

// Méthode pour créer un token de réinitialisation de mot de passe
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Middleware pour ne pas retourner les utilisateurs inactifs
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;