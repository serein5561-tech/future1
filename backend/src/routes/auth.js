const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');

// Send OTP
router.post('/send-otp', authController.sendOTPToPhone);

// Verify OTP and login
router.post('/verify-otp', authController.verifyOTP);

// Set OTP for all users (testing/admin)
router.post('/set-otp-all', authController.setOTPForAllUsers);

// Get user profile
router.get('/profile', authenticate, authController.getUserProfile);

// Update user profile
router.put('/profile', authenticate, authController.updateUserProfile);

module.exports = router;
