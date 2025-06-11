const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    // 1) Vérifier si le token existe
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError('Vous n\'êtes pas connecté. Veuillez vous connecter pour accéder.', 401)
      );
    }

    // 2) Vérifier le token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // 3) Vérifier si l'utilisateur existe toujours
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('L\'utilisateur associé à ce token n\'existe plus.', 401)
      );
    }

    // 4) Vérifier si l'utilisateur a changé son mot de passe après l'émission du token
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('L\'utilisateur a récemment changé son mot de passe. Veuillez vous reconnecter.', 401)
      );
    }

    // ACCÈS AUTORISÉ
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

// Vérifier si l'utilisateur est connecté (pour les vues seulement)
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) Vérifier le token
      const decoded = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

      // 2) Vérifier si l'utilisateur existe toujours
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Vérifier si l'utilisateur a changé son mot de passe après l'émission du token
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // IL Y A UN UTILISATEUR CONNECTÉ
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Vous n\'avez pas la permission d\'effectuer cette action', 403)
      );
    }

    next();
  };
};