const express = require('express');

const { freeModel, premiumModel, purgeCache } = require('../controllers/aiController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/free-model', freeModel);
router.post('/premium-model', restrictTo('Premium_User', 'Admin'), premiumModel);
router.delete('/purge-cache', restrictTo('Admin'), purgeCache);

module.exports = router;
