const User = require('../models/User');
const { createSendToken } = require('../config/auth');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-password');

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new AppError('Aucun utilisateur trouvé avec cet ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  // 1) Vérifier si l'utilisateur existe
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('Aucun utilisateur trouvé avec cet ID', 404));
  }

  // 2) Vérifier les permissions (seul l'admin ou l'utilisateur lui-même peut modifier)
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return next(new AppError('Vous n\'avez pas la permission de modifier cet utilisateur', 403));
  }

  // 3) Filtrer les champs autorisés
  const filteredBody = {};
  if (req.body.firstName) filteredBody.firstName = req.body.firstName;
  if (req.body.lastName) filteredBody.lastName = req.body.lastName;
  if (req.body.email) filteredBody.email = req.body.email;
  if (req.body.role && req.user.role === 'admin') filteredBody.role = req.body.role;

  // 4) Mettre à jour l'utilisateur
  const updatedUser = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true
  }).select('-password');

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  // 1) Vérifier si l'utilisateur existe
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('Aucun utilisateur trouvé avec cet ID', 404));
  }

  // 2) Vérifier les permissions (seul l'admin peut supprimer)
  if (req.user.role !== 'admin') {
    return next(new AppError('Vous n\'avez pas la permission de supprimer cet utilisateur', 403));
  }

  // 3) Supprimer l'utilisateur
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Créer une erreur si l'utilisateur essaie de mettre à jour le mot de passe
  if (req.body.password) {
    return next(
      new AppError(
        'Cette route n\'est pas pour les mises à jour de mot de passe. Utilisez /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtrer les champs non autorisés
  const filteredBody = {};
  if (req.body.firstName) filteredBody.firstName = req.body.firstName;
  if (req.body.lastName) filteredBody.lastName = req.body.lastName;
  if (req.body.email) filteredBody.email = req.body.email;

  // 3) Mettre à jour l'utilisateur
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  }).select('-password');

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.toggleMfa = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user.mfaSecret && !req.body.mfaSecret) {
    return next(new AppError('Vous devez d\'abord configurer MFA', 400));
  }

  user.mfaEnabled = !user.mfaEnabled;
  await user.save();

  res.status(200).json({
    status: 'success',
    data: {
      mfaEnabled: user.mfaEnabled
    }
  });
});