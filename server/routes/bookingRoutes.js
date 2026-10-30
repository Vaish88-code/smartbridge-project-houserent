const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getMyBookings,
  getReceivedBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   POST /api/bookings
router.post(
  '/',
  [
    body('propertyId').notEmpty().withMessage('Property ID is required'),
    body('moveInDate').notEmpty().withMessage('Move-in date is required'),
    body('message')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Message cannot exceed 500 characters'),
  ],
  createBooking
);

// @route   GET /api/bookings/my-bookings
router.get('/my-bookings', getMyBookings);

// @route   GET /api/bookings/received
router.get('/received', getReceivedBookings);

// @route   PATCH /api/bookings/:id/status
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
