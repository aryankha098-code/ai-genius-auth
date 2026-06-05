const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const users = [
  {
    id: 'usr_admin_001',
    email: 'admin@aigenius.com',
    password: bcrypt.hashSync('Admin@123', 12),
    role: 'Admin'
  },
  {
    id: 'usr_premium_001',
    email: 'premium@aigenius.com',
    password: bcrypt.hashSync('Premium@123', 12),
    role: 'Premium_User'
  },
  {
    id: 'usr_free_001',
    email: 'free@aigenius.com',
    password: bcrypt.hashSync('Free@123', 12),
    role: 'Free_User'
  }
];

const refreshTokenStore = new Map();

function findUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
}

function findUserById(id) {
  return users.find((user) => user.id === id);
}

function createRefreshTokenRecord(userId, token) {
  const tokenId = crypto.randomUUID();

  refreshTokenStore.set(token, {
    id: tokenId,
    userId,
    createdAt: new Date(),
    revoked: false
  });

  return tokenId;
}

function findRefreshToken(token) {
  return refreshTokenStore.get(token);
}

function revokeRefreshToken(token) {
  const record = refreshTokenStore.get(token);

  if (record) {
    record.revoked = true;
    refreshTokenStore.set(token, record);
  }
}

module.exports = {
  users,
  findUserByEmail,
  findUserById,
  createRefreshTokenRecord,
  findRefreshToken,
  revokeRefreshToken
};
