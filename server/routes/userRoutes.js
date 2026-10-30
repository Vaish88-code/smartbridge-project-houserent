const express = require('express');
const { body } = require('express-validator');
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/users/profile
router.get('/profile', getProfile);

// @route   PUT /api/users/profile
router.put(
  '/profile',
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be 2-50 characters'),
    body('phone')
      .optional()
      .trim()
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Please enter a valid 10-digit Indian phone number'),
  ],
  updateProfile
);

// @route   PUT /api/users/change-password
router.put(
  '/change-password',
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .notEmpty()
      .withMessage('New password is required')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters'),
  ],
  changePassword
);

module.exports = router;
