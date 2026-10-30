const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalProperties,
      pendingApprovals,
      approvedProperties,
      rejectedProperties,
      totalBookings,
      pendingBookings,
      approvedBookings,
      rejectedBookings,
      cancelledBookings,
      recentUsers,
      recentProperties,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Property.countDocuments(),
      Property.countDocuments({ approvalStatus: 'pending' }),
      Property.countDocuments({ approvalStatus: 'approved' }),
      Property.countDocuments({ approvalStatus: 'rejected' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'approved' }),
      Booking.countDocuments({ status: 'rejected' }),
      Booking.countDocuments({ status: 'cancelled' }),
      User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(5).lean(),
      Property.find()
        .populate('owner', 'name email')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProperties,
        pendingApprovals,
        approvedProperties,
        rejectedProperties,
        totalBookings,
        pendingBookings,
        approvedBookings,
        rejectedBookings,
        cancelledBookings,
      },
      recentUsers,
      recentProperties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify admin account status.',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties (admin)
// @route   GET /api/admin/properties
// @access  Private/Admin
const getAllProperties = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.approvalStatus = status;

    const properties = await Property.find(query)
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

// @desc    Approve a property
// @route   PATCH /api/admin/properties/:id/approve
// @access  Private/Admin
const approveProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    property.approvalStatus = 'approved';
    await property.save();

    const updatedProperty = await Property.findById(property._id).populate(
      'owner',
      'name email phone'
    );

    res.json({
      success: true,
      message: 'Property approved successfully.',
      property: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a property
// @route   PATCH /api/admin/properties/:id/reject
// @access  Private/Admin
const rejectProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    property.approvalStatus = 'rejected';
    await property.save();

    const updatedProperty = await Property.findById(property._id).populate(
      'owner',
      'name email phone'
    );

    res.json({
      success: true,
      message: 'Property rejected.',
      property: updatedProperty,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a property (admin)
// @route   DELETE /api/admin/properties/:id
// @access  Private/Admin
const removeProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found.',
      });
    }

    // Delete associated bookings
    await Booking.deleteMany({ property: property._id });
    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Property removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('property', 'title city rent images owner')
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

module.exports = {
  getStats,
  getUsers,
  toggleUserStatus,
  getAllProperties,
  approveProperty,
  rejectProperty,
  removeProperty,
  getAllBookings,
};
