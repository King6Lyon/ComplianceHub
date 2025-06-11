const Evidence = require('../models/Evidence');
const Control = require('../models/Control');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const path = require('path');

exports.getAllEvidence = catchAsync(async (req, res, next) => {
  const filter = { userId: req.user.id };
  
  if (req.params.controlId) {
    filter.controlId = req.params.controlId;
  }
  
  if (req.params.frameworkId) {
    filter.frameworkId = req.params.frameworkId;
  }

  const evidence = await Evidence.find(filter)
    .populate({
      path: 'controlId',
      select: 'title controlId category subCategory'
    })
    .populate({
      path: 'frameworkId',
      select: 'name'
    });

  res.status(200).json({
    status: 'success',
    results: evidence.length,
    data: {
      evidence
    }
  });
});

exports.getEvidence = catchAsync(async (req, res, next) => {
  const evidence = await Evidence.findOne({
    _id: req.params.id,
    userId: req.user.id
  }).populate({
    path: 'controlId',
    select: 'title controlId category subCategory maturityLevels'
  });

  if (!evidence) {
    return next(new AppError('Aucune preuve trouvée avec cet ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      evidence
    }
  });
});

exports.createEvidence = catchAsync(async (req, res, next) => {
  // Vérifier que le contrôle existe
  const control = await Control.findById(req.body.controlId);
  if (!control) {
    return next(new AppError('Aucun contrôle trouvé avec cet ID', 404));
  }

  // Vérifier que le framework existe
  const framework = await Framework.findById(req.body.frameworkId);
  if (!framework) {
    return next(new AppError('Aucun cadre de conformité trouvé avec cet ID', 404));
  }

  // Vérifier que le contrôle appartient au framework
  if (!framework.controls.includes(req.body.controlId)) {
    return next(new AppError('Ce contrôle n\'appartient pas au cadre de conformité spécifié', 400));
  }

  const evidenceData = {
    userId: req.user.id,
    controlId: req.body.controlId,
    frameworkId: req.body.frameworkId,
    status: req.body.status || 'not_implemented',
    comment: req.body.comment
  };

  const evidence = await Evidence.create(evidenceData);

  res.status(201).json({
    status: 'success',
    data: {
      evidence
    }
  });
});

exports.updateEvidence = catchAsync(async (req, res, next) => {
  const evidence = await Evidence.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user.id
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!evidence) {
    return next(new AppError('Aucune preuve trouvée avec cet ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      evidence
    }
  });
});

exports.deleteEvidence = catchAsync(async (req, res, next) => {
  const evidence = await Evidence.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!evidence) {
    return next(new AppError('Aucune preuve trouvée avec cet ID', 404));
  }

  // Supprimer les fichiers associés
  if (evidence.files && evidence.files.length > 0) {
    evidence.files.forEach(file => {
      const filePath = path.join(__dirname, '../uploads', file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.uploadEvidenceFiles = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError('Veuillez télécharger au moins un fichier', 400));
  }

  // Vérifier que la preuve existe et appartient à l'utilisateur
  const evidence = await Evidence.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!evidence) {
    return next(new AppError('Aucune preuve trouvée avec cet ID', 404));
  }

  // Ajouter les fichiers à la preuve
  const files = req.files.map(file => ({
    filename: file.originalname,
    path: file.filename,
    size: file.size,
    mimetype: file.mimetype
  }));

  evidence.files = [...evidence.files, ...files];
  await evidence.save();

  res.status(200).json({
    status: 'success',
    data: {
      files: evidence.files
    }
  });
});

exports.deleteEvidenceFile = catchAsync(async (req, res, next) => {
  // Vérifier que la preuve existe et appartient à l'utilisateur
  const evidence = await Evidence.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!evidence) {
    return next(new AppError('Aucune preuve trouvée avec cet ID', 404));
  }

  // Trouver le fichier à supprimer
  const fileIndex = evidence.files.findIndex(
    file => file._id.toString() === req.params.fileId
  );

  if (fileIndex === -1) {
    return next(new AppError('Aucun fichier trouvé avec cet ID', 404));
  }

  // Supprimer le fichier du système de fichiers
  const filePath = path.join(__dirname, '../uploads', evidence.files[fileIndex].path);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Supprimer le fichier de la preuve
  evidence.files.splice(fileIndex, 1);
  await evidence.save();

  res.status(204).json({
    status: 'success',
    data: null
  });
});