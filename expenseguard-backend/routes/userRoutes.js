const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

// Ye route 'getProfile' function ko call karega
router.get('/profile', protect, getProfile);

module.exports = router;