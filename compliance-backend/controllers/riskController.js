const RiskAssessment = require('../models/RiskAssessment');
const Framework = require('../models/Framework');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getRiskAssessments = catchAsync(async (req, res, next) => {
  console.log('User ID from token:', req.user.id); 
  const filter = { userId: req.user.id };
  
  if (req.params.frameworkId) {
    filter.frameworkId = req.params.frameworkId;
  }

  const riskAssessments = await RiskAssessment.find(filter)
    .populate({
      path: 'frameworkId',
      select: 'name'
    });

  res.status(200).json({
    status: 'success',
    results: riskAssessments.length,
    data: {
      riskAssessments
    }
  });
});

exports.getRiskAssessment = catchAsync(async (req, res, next) => {
  const riskAssessment = await RiskAssessment.findOne({
    _id: req.params.id,
    userId: req.user.id
  }).populate({
    path: 'frameworkId',
    select: 'name'
  });

  if (!riskAssessment) {
    return next(new AppError('Aucune évaluation des risques trouvée avec cet ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      riskAssessment
    }
  });
});

exports.createRiskAssessment = catchAsync(async (req, res, next) => {
   console.log('Requête reçue - Body:', req.body); // Ajoutez cette ligne
  console.log('User ID:', req.user.id); // Et cette ligne
  // Vérifier que le framework existe
  const framework = await Framework.findOne({ _id: req.body.frameworkId }); // Utilisez findOne au lieu de findById
  console.log('Framework trouvé:', framework);
  if (!framework) {
    return next(new AppError('Aucun cadre de conformité trouvé avec cet ID', 404));
  }

  // Calculer le score initial
  let score = 0;
  if (req.body.risks && req.body.risks.length > 0) {
    const total = req.body.risks.reduce((sum, risk) => {
      return sum + (risk.impact * risk.likelihood);
    }, 0);
    score = Math.round(total / req.body.risks.length);
  }

  const riskAssessmentData = {
    userId: req.user.id,
    frameworkId: req.body.frameworkId,
    risks: req.body.risks,
    score
  };

  const riskAssessment = await RiskAssessment.create(riskAssessmentData);

  res.status(201).json({
    status: 'success',
    data: {
      riskAssessment
    }
  });
});

exports.updateRiskAssessment = catchAsync(async (req, res, next) => {
  // Calculer le nouveau score si les risques sont mis à jour
  let updateData = req.body;
  if (req.body.risks) {
    const total = req.body.risks.reduce((sum, risk) => {
      return sum + (risk.impact * risk.likelihood);
    }, 0);
    updateData.score = Math.round(total / req.body.risks.length);
    updateData.updatedAt = Date.now();
  }

  const riskAssessment = await RiskAssessment.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user.id
    },
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  if (!riskAssessment) {
    return next(new AppError('Aucune évaluation des risques trouvée avec cet ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      riskAssessment
    }
  });
});

exports.deleteRiskAssessment = catchAsync(async (req, res, next) => {
  const riskAssessment = await RiskAssessment.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!riskAssessment) {
    return next(new AppError('Aucune évaluation des risques trouvée avec cet ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.addRisk = catchAsync(async (req, res, next) => {
  const riskAssessment = await RiskAssessment.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!riskAssessment) {
    return next(new AppError('Aucune évaluation des risques trouvée avec cet ID', 404));
  }

  // Calculer le nouveau score
  const newRisk = req.body;
  const newScore = Math.round(
    (riskAssessment.score * riskAssessment.risks.length + 
     newRisk.impact * newRisk.likelihood) / 
    (riskAssessment.risks.length + 1)
  );

  riskAssessment.risks.push(newRisk);
  riskAssessment.score = newScore;
  riskAssessment.updatedAt = Date.now();
  await riskAssessment.save();

  res.status(200).json({
    status: 'success',
    data: {
      riskAssessment
    }
  });
});

exports.updateRisk = catchAsync(async (req, res, next) => {
  const riskAssessment = await RiskAssessment.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!riskAssessment) {
    return next(new AppError('Aucune évaluation des risques trouvée avec cet ID', 404));
  }

  // Trouver le risque à mettre à jour
  const riskIndex = riskAssessment.risks.findIndex(
    risk => risk._id.toString() === req.params.riskId
  );

  if (riskIndex === -1) {
    return next(new AppError('Aucun risque trouvé avec cet ID', 404));
  }

  // Mettre à jour le risque
  riskAssessment.risks[riskIndex] = {
    ...riskAssessment.risks[riskIndex].toObject(),
    ...req.body
  };

  // Recalculer le score
  const total = riskAssessment.risks.reduce((sum, risk) => {
    return sum + (risk.impact * risk.likelihood);
  }, 0);
  riskAssessment.score = Math.round(total / riskAssessment.risks.length);
  riskAssessment.updatedAt = Date.now();

  await riskAssessment.save();

  res.status(200).json({
    status: 'success',
    data: {
      riskAssessment
    }
  });
});

exports.deleteRisk = catchAsync(async (req, res, next) => {
  const riskAssessment = await RiskAssessment.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!riskAssessment) {
    return next(new AppError('Aucune évaluation des risques trouvée avec cet ID', 404));
  }

  // Trouver le risque à supprimer
  const riskIndex = riskAssessment.risks.findIndex(
    risk => risk._id.toString() === req.params.riskId
  );

  if (riskIndex === -1) {
    return next(new AppError('Aucun risque trouvé avec cet ID', 404));
  }

  // Supprimer le risque
  riskAssessment.risks.splice(riskIndex, 1);

  // Recalculer le score si des risques restent
  if (riskAssessment.risks.length > 0) {
    const total = riskAssessment.risks.reduce((sum, risk) => {
      return sum + (risk.impact * risk.likelihood);
    }, 0);
    riskAssessment.score = Math.round(total / riskAssessment.risks.length);
  } else {
    riskAssessment.score = 0;
  }

  riskAssessment.updatedAt = Date.now();
  await riskAssessment.save();

  res.status(200).json({
    status: 'success',
    data: {
      riskAssessment
    }
  });
});