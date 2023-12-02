// Error handling middleware
const ErrorResponse = require('../utils/errorResponse.js');

// Async handler middleware (to avoid having to write try/catch blocks in every controller)
const asyncHandler = require('../middleware/async.js');

// @desc: Controller for courses
const Course = require('../models/Course.js');

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  // If there is a bootcampId, find the courses for that bootcampId
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find();
  }

  // Execute query
  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});
