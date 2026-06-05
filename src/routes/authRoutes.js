const express = require('express');

const { login, logout, refresh } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

module.exports = router;
