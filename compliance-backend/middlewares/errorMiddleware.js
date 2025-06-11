const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Valeur invalide ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Valeur dupliquée: ${value}. Veuillez utiliser une autre valeur!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Données d'entrée invalides. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Token invalide. Veuillez vous reconnecter!', 401);

const handleJWTExpiredError = () =>
  new AppError('Votre token a expiré! Veuillez vous reconnecter.', 401);

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // RENDERED WEBSITE
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Quelque chose a mal tourné!',
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // Erreur opérationnelle, de confiance : envoyer le message au client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // Erreur de programmation ou autre erreur inconnue : ne pas divulguer les détails
    console.error('ERROR 💥', err);
    return res.status(500).json({
      status: 'error',
      message: 'Quelque chose a mal tourné!'
    });
  }

  // RENDERED WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Quelque chose a mal tourné!',
      msg: err.message
    });
  }
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Quelque chose a mal tourné!',
    msg: 'Veuillez réessayer plus tard.'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};