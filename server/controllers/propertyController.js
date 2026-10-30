const { validationResult } = require('express-validator');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const path = require('path');
const fs = require('fs');

// @desc    Get all approved & available properties (public)
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res, next) => {
  try {
    const {
      search,
      city,
      propertyType,
      furnishing,
      minRent,
      maxRent,
      bedrooms,
      amenities,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    // Build query - only show approved and available properties
    const query = {
      approvalStatus: 'approved',
      isAvailable: true,
    };

    // Search by title, city, or address
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by city
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    // Filter by property type
    if (propertyType) {
      query.propertyType = propertyType;
    }

    // Filter by furnishing
    if (furnishing) {
      query.furnishing = furnishing;
    }

    // Filter by rent range
    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }

    // Filter by bedrooms
    if (bedrooms) {
      query.bedrooms = Number(bedrooms);
    }

    // Filter by amenities
    if (amenities) {
      const amenityList = amenities.split(',');
      query.amenities = { $all: amenityList };
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === 'rent_asc') sortOption = { rent: 1 };
    else if (sort === 'rent_desc') sortOption = { rent: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate('owner', 'name email phone')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Property.countDocuments(query),
    ]);

    res.json({
      success: true,
      properties,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Only show approved properties to non-owners
    if (
      property.approvalStatus !== 'approved' &&
      (!req.user || (req.user._id.toString() !== property.owner._id.toString() && req.user.role !== 'admin'))
    ) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    res.json({
      success: true,
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private
const createProperty = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((e) => e.msg).join(', '),
      });
    }

    const propertyData = {
      ...req.body,
      owner: req.user._id,
      approvalStatus: 'approved',
    };

    // Handle amenities - parse if string
    if (typeof propertyData.amenities === 'string') {
      propertyData.amenities = propertyData.amenities.split(',').map(a => a.trim());
    }

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      propertyData.images = req.files.map(
        (file) => `/uploads/${file.filename}`
      );
    }

    const property = await Property.create(propertyData);
    const populatedProperty = await Property.findById(property._id).populate(
      'owner',
      'name email phone'
    );

    res.status(201).json({
      success: true,
      message: 'Property listed successfully! Awaiting admin approval.',
      property: populatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private (Owner only)
const updateProperty = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array().map((e) => e.msg).join(', '),
      });
    }

    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Check ownership
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property.',
      });
    }

    // Handle amenities
    if (typeof req.body.amenities === 'string') {
      req.body.amenities = req.body.amenities.split(',').map(a => a.trim());
    }

    // Important fields that trigger re-approval
    const reapprovalFields = ['title', 'description', 'rent', 'deposit', 'address', 'city', 'propertyType'];
    const needsReapproval = reapprovalFields.some(
      (field) => req.body[field] && req.body[field] !== property[field]?.toString()
    );

    if (needsReapproval && property.approvalStatus === 'approved') {
      req.body.approvalStatus = 'pending';
    }

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      req.body.images = [...(property.images || []), ...newImages];
    }

    property = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('owner', 'name email phone');

    res.json({
      success: true,
      message: needsReapproval
        ? 'Property updated. Sent for re-approval.'
        : 'Property updated successfully.',
      property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private (Owner or Admin)
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Check ownership or admin
    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property.',
      });
    }

    // Delete associated bookings
    await Booking.deleteMany({ property: property._id });

    // Delete property images from uploads
    if (property.images && property.images.length > 0) {
      property.images.forEach((img) => {
        const imgPath = path.join(__dirname, '..', img);
        if (fs.existsSync(imgPath)) {
          fs.unlinkSync(imgPath);
        }
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Property deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's properties
// @route   GET /api/properties/my-properties
// @access  Private
const getMyProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      properties,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
};
