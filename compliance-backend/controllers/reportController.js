const Report = require('../models/AuditReport');
const Framework = require('../models/Framework');
const Evidence = require('../models/Evidence');
const { generateComplianceReport } = require('../services/reportService');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const path = require('path');

exports.getAllReports = catchAsync(async (req, res, next) => {
  const filter = { userId: req.user.id };
  
  if (req.params.frameworkId) {
    filter.frameworkId = req.params.frameworkId;
  }

  const reports = await Report.find(filter)
    .populate({
      path: 'frameworkId',
      select: 'name'
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: reports.length,
    data: {
      reports
    }
  });
});

exports.getReport = catchAsync(async (req, res, next) => {
  const report = await Report.findOne({
    _id: req.params.id,
    userId: req.user.id
  }).populate({
    path: 'frameworkId',
    select: 'name'
  });

  if (!report) {
    return next(new AppError('Aucun rapport trouvé avec cet ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      report
    }
  });
});

exports.generateReport = catchAsync(async (req, res, next) => {
  const framework = await Framework.findById(req.params.frameworkId);
  if (!framework) {
    return next(new AppError('Aucun cadre de conformité trouvé avec cet ID', 404));
  }

  const evidences = await Evidence.find({
    userId: req.user.id,
    frameworkId: req.params.frameworkId
  }).populate({
    path: 'controlId',
    select: 'title controlId category subCategory maturityLevels'
  });

  const { reportData, filePath } = await generateComplianceReport(
    framework,
    evidences,
    req.user
  );

  const report = await Report.create({
    userId: req.user.id,
    frameworkId: req.params.frameworkId,
    title: `Rapport de conformité ${framework.name}`,
    description: `Rapport généré le ${new Date().toLocaleDateString()}`,
    controls: reportData.controls,
    score: reportData.complianceScore,
    filePath,
    recommendations: reportData.recommendations
  });

  res.status(201).json({
    status: 'success',
    data: {
      report
    }
  });
});

exports.downloadReport = catchAsync(async (req, res, next) => {
  const report = await Report.findOne({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!report) {
    return next(new AppError('Aucun rapport trouvé avec cet ID', 404));
  }

  const filePath = path.join(__dirname, '../', report.filePath);
  
  if (!fs.existsSync(filePath)) {
    return next(new AppError('Le fichier du rapport est introuvable', 404));
  }

  res.download(filePath);
});

exports.deleteReport = catchAsync(async (req, res, next) => {
  const report = await Report.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id
  });

  if (!report) {
    return next(new AppError('Aucun rapport trouvé avec cet ID', 404));
  }

  // Supprimer le fichier du rapport
  if (report.filePath) {
    const filePath = path.join(__dirname, '../', report.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});