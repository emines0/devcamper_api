// @desc: Controller for bootcamps
const Bootcamp = require('../models/Bootcamp.js');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    // If the ID is not in the database, return an error
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    // res.status(400).json({ success: false });
    next(err);
  }
};

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    // Find the bootcamp by ID and update it
    const bootcamp = await Bootcamp.findOneAndUpdate(req.param.id, req.body, {
      new: true,
      runValidators: true,
    });

    // If the ID is not in the database, return an error
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    // Return a success message
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    // Find the bootcamp by ID and delete it
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    // If the ID is not in the database, return an error
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    // Return a success message
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    // Return an error message
    res.status(400).json({ success: false });
  }
};
