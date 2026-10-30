const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['Apartment', 'Independent House', 'Villa', 'Studio', 'PG / Hostel'],
    },
    rent: {
      type: Number,
      required: [true, 'Monthly rent is required'],
      min: [500, 'Rent must be at least ₹500'],
      max: [1000000, 'Rent cannot exceed ₹10,00,000'],
    },
    deposit: {
      type: Number,
      required: [true, 'Security deposit is required'],
      min: [0, 'Deposit cannot be negative'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: [0, 'Bedrooms cannot be negative'],
      max: [20, 'Bedrooms cannot exceed 20'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: [1, 'Must have at least 1 bathroom'],
      max: [10, 'Bathrooms cannot exceed 10'],
    },
    area: {
      type: Number,
      required: [true, 'Area is required'],
      min: [100, 'Area must be at least 100 sq ft'],
    },
    furnishing: {
      type: String,
      required: [true, 'Furnishing status is required'],
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    },
    amenities: {
      type: [String],
      default: [],
      enum: [
        'Parking',
        'Wi-Fi',
        'Air Conditioning',
        'Water Supply',
        'Power Backup',
        'Security',
        'Lift',
        'Balcony',
      ],
    },
    images: {
      type: [String],
      default: [],
    },
    availableFrom: {
      type: Date,
      required: [true, 'Available from date is required'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filtering
propertySchema.index({ city: 1, approvalStatus: 1 });
propertySchema.index({ rent: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ approvalStatus: 1, isAvailable: 1 });
propertySchema.index({ title: 'text', city: 'text', address: 'text' });

module.exports = mongoose.model('Property', propertySchema);
