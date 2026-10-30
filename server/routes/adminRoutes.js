const express = require('express');
const {
  getStats,
  getUsers,
  toggleUserStatus,
  getAllProperties,
  approveProperty,
  rejectProperty,
  removeProperty,
  getAllBookings,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const router = express.Router();

// All routes require authentication + admin role
router.use(protect);
router.use(admin);

// Dashboard stats
router.get('/stats', getStats);

// User management
router.get('/users', getUsers);
router.patch('/users/:id/status', toggleUserStatus);

// Property management
router.get('/properties', getAllProperties);
router.patch('/properties/:id/approve', approveProperty);
router.patch('/properties/:id/reject', rejectProperty);
router.delete('/properties/:id', removeProperty);

// Booking management
router.get('/bookings', getAllBookings);

module.exports = router;
