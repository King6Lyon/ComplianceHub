const AppError = require('../utils/appError');

exports.checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const doc = await model.findById(req.params.id);
      
      if (!doc) {
        return next(new AppError('Aucun document trouvé avec cet ID', 404));
      }

      // Vérifier si l'utilisateur est le propriétaire ou un admin
      if (doc.userId && doc.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
          new AppError('Vous n\'avez pas la permission d\'effectuer cette action', 403)
        );
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

exports.checkFrameworkAccess = async (req, res, next) => {
  try {
    // Pour les routes qui nécessitent frameworkId dans les paramètres
    const frameworkId = req.params.frameworkId || req.body.frameworkId;
    
    if (!frameworkId) {
      return next();
    }

    // Vérifier si l'utilisateur a accès à ce framework
    const user = await User.findById(req.user.id);
    
    if (!user.frameworks.some(f => f.frameworkId.toString() === frameworkId) && 
        req.user.role !== 'admin') {
      return next(
        new AppError('Vous n\'avez pas accès à ce cadre de conformité', 403)
      );
    }

    next();
  } catch (err) {
    next(err);
  }
};