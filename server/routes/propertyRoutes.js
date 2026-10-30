const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `property-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, JPG, PNG, and WebP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Validation rules
const propertyValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be 5-100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be 20-2000 characters'),
  body('propertyType')
    .notEmpty()
    .withMessage('Property type is required')
    .isIn(['Apartment', 'Independent House', 'Villa', 'Studio', 'PG / Hostel'])
    .withMessage('Invalid property type'),
  body('rent')
    .notEmpty()
    .withMessage('Monthly rent is required')
    .isNumeric()
    .withMessage('Rent must be a number'),
  body('deposit')
    .notEmpty()
    .withMessage('Security deposit is required')
    .isNumeric()
    .withMessage('Deposit must be a number'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pincode')
    .trim()
    .notEmpty()
    .withMessage('Pincode is required')
    .matches(/^\d{6}$/)
    .withMessage('Please enter a valid 6-digit pincode'),
  body('bedrooms')
    .notEmpty()
    .withMessage('Number of bedrooms is required')
    .isNumeric()
    .withMessage('Bedrooms must be a number'),
  body('bathrooms')
    .notEmpty()
    .withMessage('Number of bathrooms is required')
    .isNumeric()
    .withMessage('Bathrooms must be a number'),
  body('area')
    .notEmpty()
    .withMessage('Area is required')
    .isNumeric()
    .withMessage('Area must be a number'),
  body('furnishing')
    .notEmpty()
    .withMessage('Furnishing status is required')
    .isIn(['Furnished', 'Semi-Furnished', 'Unfurnished'])
    .withMessage('Invalid furnishing status'),
  body('availableFrom')
    .notEmpty()
    .withMessage('Available from date is required'),
  body('contactNumber')
    .trim()
    .notEmpty()
    .withMessage('Contact number is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid 10-digit Indian phone number'),
];

// Public routes
router.get('/', getProperties);

// Private routes - order matters: specific routes before parameterized ones
router.get('/my-properties', protect, getMyProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, upload.array('images', 5), propertyValidation, createProperty);
router.put('/:id', protect, upload.array('images', 5), updateProperty);
router.delete('/:id', protect, deleteProperty);

module.exports = router;
