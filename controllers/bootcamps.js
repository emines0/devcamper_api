// Error handling middleware
const ErrorResponse = require('../utils/errorResponse.js');

// Async handler middleware (to avoid having to write try/catch blocks in every controller)
const asyncHandler = require('../middleware/async.js');

// @desc: Controller for bootcamps
const Bootcamp = require('../models/Bootcamp.js');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // Find all bootcamps
  const bootcamps = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  // Find the bootcamp by ID
  const bootcamp = await Bootcamp.findById(req.params.id);

  // If the ID is not in the database, return an error
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // Create a new bootcamp
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  // Find the bootcamp by ID and update it
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // If the ID is not in the database, return an error
  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }

  // Return a success message
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  // Find the bootcamp by ID and delete it
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  // If the ID is not in the database, return an error
  if (!bootcamp) {
    return res.status(400).json({ success: false });
  }

  // Return a success message
  res.status(200).json({ success: true, data: {} });
});
