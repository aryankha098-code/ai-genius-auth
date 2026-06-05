const bcrypt = require('bcryptjs');

const AppError = require('../utils/AppError');
const { getRefreshCookieOptions } = require('../utils/cookies');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/tokens');
const {
  createRefreshTokenRecord,
  findRefreshToken,
  findUserByEmail,
  findUserById,
  revokeRefreshToken
} = require('../data/mockDb');

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role
  };
}

function issueTokens(res, user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  createRefreshTokenRecord(user.id, refreshToken);
  res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

  return accessToken;
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Email and password are required.', 400));
    }

    const user = findUserByEmail(email);
    const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !passwordMatches) {
      return next(new AppError('Invalid email or password.', 401));
    }

    const accessToken = issueTokens(res, user);

    return res.status(200).json({
      status: 'success',
      accessToken,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return next(error);
  }
}

function refresh(req, res, next) {
  const token = req.cookies.refreshToken;

  if (!token) {
    return next(new AppError('Refresh token cookie is missing.', 401));
  }

  try {
    const decoded = verifyRefreshToken(token);
    const storedToken = findRefreshToken(token);

    if (!storedToken || storedToken.revoked || storedToken.userId !== decoded.id) {
      return next(new AppError('Refresh token is not valid or has been revoked.', 403));
    }

    const user = findUserById(decoded.id);

    if (!user) {
      return next(new AppError('The user for this refresh token no longer exists.', 401));
    }

    const accessToken = signAccessToken(user);

    return res.status(200).json({
      status: 'success',
      accessToken,
      user: sanitizeUser(user)
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Refresh token expired. Please login again.', 401));
    }

    return next(new AppError('Invalid refresh token.', 401));
  }
}

function logout(req, res) {
  const token = req.cookies.refreshToken;

  if (token) {
    revokeRefreshToken(token);
  }

  res.clearCookie('refreshToken', getRefreshCookieOptions());

  return res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
}

module.exports = {
  login,
  refresh,
  logout
};
