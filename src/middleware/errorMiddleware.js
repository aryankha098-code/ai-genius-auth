function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    status: error.status || 'error',
    message: error.message || 'Internal server error'
  });
}

module.exports = {
  notFound,
  errorHandler
};
