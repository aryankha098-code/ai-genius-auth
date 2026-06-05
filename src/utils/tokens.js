const jwt = require('jsonwebtoken');

function createTokenPayload(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role
  };
}

function signAccessToken(user) {
  return jwt.sign(createTokenPayload(user), process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
  });
}

function signRefreshToken(user) {
  return jwt.sign(createTokenPayload(user), process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
