const Control = require('../models/Control');
const Framework = require('../models/Framework');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllControls = catchAsync(async (req, res, next) => {
  const filters = { frameworkId: req.params.frameworkId };
  
  // Filtrer par catégorie si spécifié
  if (req.query.category) {
    filters.category = req.query.category;
  }

  // Filtrer par niveau de maturité si spécifié
  if (req.query.level) {
    filters['maturityLevels.level'] = parseInt(req.query.level);
  }

  const controls = await Control.find(filters);

  res.status(200).json({
    status: 'success',
    results: controls.length,
    data: {
      controls
    }
  });
});

exports.getControl = catchAsync(async (req, res, next) => {
  const control = await Control.findById(req.params.id);

  if (!control) {
    return next(new AppError('Aucun contrôle trouvé avec cet ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      control
    }
  });
});

exports.createControl = catchAsync(async (req, res, next) => {
  // Seul l'admin peut créer un contrôle
  if (req.user.role !== 'admin') {
    return next(new AppError('Vous n\'avez pas la permission de créer un contrôle', 403));
  }

  // Vérifier que le framework existe
  const framework = await Framework.findById(req.body.frameworkId);
  if (!framework) {
    return next(new AppError('Aucun cadre de conformité trouvé avec cet ID', 404));
  }

  const newControl = await Control.create(req.body);

  // Ajouter le contrôle au framework
  framework.controls.push(newControl._id);
  await framework.save();

  res.status(201).json({
    status: 'success',
    data: {
      control: newControl
    }
  });
});

exports.updateControl = catchAsync(async (req, res, next) => {
  // Seul l'admin peut modifier un contrôle
  if (req.user.role !== 'admin') {
    return next(new AppError('Vous n\'avez pas la permission de modifier ce contrôle', 403));
  }

  const control = await Control.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!control) {
    return next(new AppError('Aucun contrôle trouvé avec cet ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      control
    }
  });
});

exports.deleteControl = catchAsync(async (req, res, next) => {
  // Seul l'admin peut supprimer un contrôle
  if (req.user.role !== 'admin') {
    return next(new AppError('Vous n\'avez pas la permission de supprimer ce contrôle', 403));
  }

  const control = await Control.findByIdAndDelete(req.params.id);

  if (!control) {
    return next(new AppError('Aucun contrôle trouvé avec cet ID', 404));
  }

  // Supprimer le contrôle du framework
  await Framework.updateOne(
    { _id: control.frameworkId },
    { $pull: { controls: control._id } }
  );

  res.status(204).json({
    status: 'success',
    data: null
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