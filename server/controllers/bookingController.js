const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc    Create a booking request
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((e) => e.msg).join(', '),
      });
    }

    const { propertyId, moveInDate, message } = req.body;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Check if property is approved and available
    if (property.approvalStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This property is not available for booking.',
      });
    }

    if (!property.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'This property is no longer available.',
      });
    }

    // Prevent booking own property
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book your own property.',
      });
    }

    // Check for duplicate active booking
    const existingBooking = await Booking.findOne({
      property: propertyId,
      user: req.user._id,
      status: { $in: ['pending', 'approved'] },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active booking request for this property.',
      });
    }

    const booking = await Booking.create({
      property: propertyId,
      user: req.user._id,
      moveInDate,
      message: message || '',
      status: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('property', 'title city rent images owner')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully!',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'property',
        select: 'title city rent images owner approvalStatus',
        populate: {
          path: 'owner',
          select: 'name email phone',
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking requests received for user's properties
// @route   GET /api/bookings/received
// @access  Private
const getReceivedBookings = async (req, res, next) => {
  try {
    // Find all properties owned by the user
    const myProperties = await Property.find({ owner: req.user._id }).select('_id');
    const propertyIds = myProperties.map((p) => p._id);

    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate('property', 'title city rent images')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (approve/reject/cancel)
// @route   PATCH /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['approved', 'rejected', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: approved, rejected, or cancelled.',
      });
    }

    const booking = await Booking.findById(req.params.id).populate('property');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Validate status transitions
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a cancelled booking.',
      });
    }

    if (booking.status === 'approved' && status !== 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'An approved booking can only be cancelled.',
      });
    }

    if (booking.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a rejected booking.',
      });
    }

    // Authorization checks
    if (status === 'cancelled') {
      // Only the booking user can cancel
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Only the booking requester can cancel this booking.',
        });
      }
    } else {
      // Only the property owner can approve/reject
      if (booking.property.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Only the property owner can approve or reject bookings.',
        });
      }
    }

    // If approving, check for conflicting approved bookings
    if (status === 'approved') {
      const conflicting = await Booking.findOne({
        property: booking.property._id,
        status: 'approved',
        _id: { $ne: booking._id },
      });

      if (conflicting) {
        return res.status(400).json({
          success: false,
          message: 'Another booking for this property has already been approved.',
        });
      }

      // Mark property as unavailable
      await Property.findByIdAndUpdate(booking.property._id, {
        isAvailable: false,
      });
    }

    // If cancelling an approved booking, make property available again
    if (status === 'cancelled' && booking.status === 'approved') {
      await Property.findByIdAndUpdate(booking.property._id, {
        isAvailable: true,
      });
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('property', 'title city rent images owner')
      .populate('user', 'name email phone');

    res.json({
      success: true,
      message: `Booking ${status} successfully.`,
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getReceivedBookings,
  updateBookingStatus,
};
