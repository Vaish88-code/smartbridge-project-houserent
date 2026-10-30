const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    moveInDate: {
      type: Date,
      required: [true, 'Move-in date is required'],
    },
    message: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bookingSchema.index({ property: 1, user: 1 });
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
