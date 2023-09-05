const AppError = require('./../util/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleMongoErrorDB = (err) => {
  const value = err.errmsg.match(/"(.*?)"/g)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidatorErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.properties.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// For development
const sendErrorDev = (err, req, res) => {
  // For API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  // Rendered Website
  return res.status(err.statusCode).render('error', {
    title: 'Xảy ra lỗi',
    msg: err.message,
  });
};

// For production
const sendErrorProd = (err, req, res) => {
  // For API
  if (req.originalUrl.startsWith('/api')) {
    // operational = true
    if (err.isOperational === true) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      return res.status(err.statusCode).json({
        status: 'error',
        message: 'Something went wrong !! 💥',
      });
    }
  }
  // Rendered Website
  return res.status(statusCode).render('error', {
    title: 'Xảy ra lỗi',
    msg: 'Đã xảy ra lôi 💥, vui lòng thử lại. ',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    if (err.name === 'CastError') {
      err = handleCastErrorDB(err);
    } else if (err.code === 11000) {
      err = handleMongoErrorDB(err);
    } else if (err.name === 'ValidationError') {
      err = handleValidatorErrorDB(err);
    }
    sendErrorProd(err, req, res);
  }
};
