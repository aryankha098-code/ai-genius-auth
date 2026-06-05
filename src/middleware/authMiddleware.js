const AppError = require('../utils/AppError');
const { verifyAccessToken } = require('../utils/tokens');
const { findUserById } = require('../data/mockDb');

function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Authentication required. Provide a Bearer token.', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    const currentUser = findUserById(decoded.id);

    if (!currentUser) {
      return next(new AppError('The user for this token no longer exists.', 401));
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Access token expired. Use the refresh endpoint.', 401));
    }

    return next(new AppError('Invalid access token.', 401));
  }
}

function restrictTo(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required before authorization.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }

    return next();
  };
}

module.exports = {
  protect,
  restrictTo
};
