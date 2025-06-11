const Framework = require('../models/Framework');
const Control = require('../models/Control');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllFrameworks = catchAsync(async (req, res, next) => {
  const frameworks = await Framework.find().populate({
    path: 'controls',
    select: 'title controlId category subCategory'
  });

  res.status(200).json({
    status: 'success',
    results: frameworks.length,
    data: {
      frameworks
    }
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

exports.getFrameworkProgress = catchAsync(async (req, res, next) => {
  const framework = await Framework.findById(req.params.id);
  if (!framework) {
    return next(new AppError('Aucun cadre de conformité trouvé avec cet ID', 404));
  }

  const controls = await Control.find({ frameworkId: req.params.id });
  const evidences = await Evidence.find({ 
    userId: req.user.id,
    frameworkId: req.params.id 
  });

  // Calculer la progression
  let implemented = 0;
  let partial = 0;
  let notImplemented = 0;
  let notApplicable = 0;

  controls.forEach(control => {
    const evidence = evidences.find(e => e.controlId.equals(control._id));
    if (evidence) {
      switch (evidence.status) {
        case 'implemented':
          implemented++;
          break;
        case 'partial':
          partial++;
          break;
        case 'not_applicable':
          notApplicable++;
          break;
        default:
          notImplemented++;
      }
    } else {
      notImplemented++;
    }
  });

  const totalControls = controls.length;
  const overallProgress = Math.round(
    ((implemented + partial * 0.5) / (totalControls - notApplicable)) * 100
  ) || 0;

  res.status(200).json({
    status: 'success',
    data: {
      framework: framework.name,
      totalControls,
      implemented,
      partial,
      notImplemented,
      notApplicable,
      overallProgress
    }
  });
});