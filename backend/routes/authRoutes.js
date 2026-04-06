const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateProfile, getAllUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;