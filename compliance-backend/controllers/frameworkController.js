const Framework = require('../models/Framework');
const Control = require('../models/Control');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');


exports.getAllFrameworks = catchAsync(async (req, res, next) => {
  const frameworks = await Framework.find().select('-__v').lean();
  
  res.status(200).json({
    success: true,
    data: frameworks
  });
});

exports.getFramework = catchAsync(async (req, res, next) => {
  const framework = await Framework.findById(req.params.id).populate({
    path: 'controls',
    select: 'title controlId category subCategory maturityLevels'
  });

  if (!framework) {
    return next(new AppError('Aucun cadre de conformité trouvé avec cet ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      framework
    }
  });
});

exports.createFramework = catchAsync(async (req, res, next) => {
  // Seul l'admin peut créer un nouveau cadre
  if (req.user.role !== 'admin') {
    return next(new AppError('Vous n\'avez pas la permission de créer un cadre de conformité', 403));
  }

  const newFramework = await Framework.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      framework: newFramework
    }
  });
});

exports.updateFramework = catchAsync(async (req, res, next) => {
  // Seul l'admin peut modifier un cadre
  if (req.user.role !== 'admin') {
    return next(new AppError('Vous n\'avez pas la permission de modifier ce cadre de conformité', 403));
  }

  const framework = await Framework.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!framework) {
    return next(new AppError('Aucun cadre de conformité trouvé avec cet ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      framework
    }
  });
});

exports.getFrameworkControls = catchAsync(async (req, res, next) => {
  console.log('=== DEBUT APPEL CONTROLES ===');
  console.log('Headers:', req.headers);
  console.log('Framework ID:', req.params.frameworkId);

  // Ajoutez ceci pour vérifier l'accès à MongoDB
  try {
    const count = await mongoose.connection.db.collection('controls').countDocuments();
    console.log(`Total controls in DB: ${count}`);
  } catch (dbErr) {
    console.error('Erreur DB:', dbErr);
  }

  const controls = await Control.find({ frameworkId: req.params.id})
    .lean()
    .maxTimeMS(5000) // Timeout MongoDB
    .exec();

  console.log('=== FIN APPEL CONTROLES ===');
  res.status(200).json({
    status: 'success',
    results: controls.length,
    data: { controls }
  });
});

exports.getControlCategories = catchAsync(async (req, res, next) => {
  const categories = await Control.distinct('category', { 
    frameworkId: req.params.frameworkId 
  });

  res.status(200).json({
    status: 'success',
    data: {
      categories
    }
  });
});

exports.deleteFramework = catchAsync(async (req, res, next) => {
  // Seul l'admin peut supprimer un cadre
  if (req.user.role !== 'admin') {
    return next(new AppError('Vous n\'avez pas la permission de supprimer ce cadre de conformité', 403));
  }

  const framework = await Framework.findByIdAndDelete(req.params.id);

  if (!framework) {
    return next(new AppError('Aucun cadre de conformité trouvé avec cet ID', 404));
  }

  // Supprimer tous les contrôles associés
  await Control.deleteMany({ frameworkId: req.params.id });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getFrameworkProgress = catchAsync(async (req, res) => {
  const frameworkId = req.params.id;
  
  // Correction 1: Récupération explicite des données
  const controls = await Control.find({ frameworkId });
  const evidences = await Evidence.find({ frameworkId });

  // Correction 2: Compteurs initialisés proprement
  let implemented = 0;
  let partial = 0;
  let notImplemented = 0;
  let notApplicable = 0;

  // Correction 3: Logique de calcul simplifiée et sécurisée
  controls.forEach(control => {
    const evidence = evidences.find(e => e.controlId.equals(control._id));
    // Utilisation de l'opérateur ?. et fallback sur control.status
    switch (evidence?.status || control.status) {
      case 'implemented': implemented++; break;
      case 'partially_implemented': partial++; break;
      case 'not_applicable': notApplicable++; break;
      default: notImplemented++;
    }
  });

  // Correction 4: Calcul du pourcentage sécurisé
  const totalControls = controls.length;
  const overallProgress = Math.round(
    ((implemented + partial * 0.5) / (totalControls - notApplicable)) * 100
  ) || 0; // Évite les divisions par 0

  // Correction 5: Réponse unique et cohérente
  res.status(200).json({
    success: true, // Structure standardisée
    data: {
      implemented,
      partial, // Nom plus court mais clair
      notImplemented,
      notApplicable,
      overallProgress,
      totalControls
    }
  });
});