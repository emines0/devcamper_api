// Error handling middleware
const ErrorResponse = require('../utils/errorResponse.js');

// Async handler middleware (to avoid having to write try/catch blocks in every controller)
const asyncHandler = require('../middleware/async.js');

// Geocoder middleware
const geocoder = require('../utils/geocoder.js');

// @desc: Controller for bootcamps
const Bootcamp = require('../models/Bootcamp.js');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop through removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  console.log(reqQuery);

  // Create a query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, $lt, $lte, $in) (mongo db operators)
  // \b is a word boundary
  // g is a global search
  // $gt is greater than
  // $gte is greater than or equal to
  // $lt is less than
  // $lte is less than or equal to
  // $in is in an array

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Find rescourse based on query
  // If query is empty (i.e. no query), find all rescources
  query = Bootcamp.find(JSON.parse(queryStr));

  // Select fields
  // If there is a select query, select the fields
  if (req.query.select) {
    // Split the select query by commas
    const fields = req.query.select.split(',').join(' ');
    // Select the fields
    query = query.select(fields);
  }

  // Sort
  // If there is a sort query, sort the fields
  if (req.query.sort) {
    // Split the sort query by commas
    const sortBy = req.query.sort.split(',').join(' ');
    // Sort the fields
    query = query.sort(sortBy);
  } else {
    // Sort by date (descending)
    query = query.sort('-createdAt');
  }

  // Pagination
  // If there is a page query, paginate the fields
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25; // 25 results per page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments(); // Count the number of bootcamps

  // Skip the number of results
  query = query.skip(startIndex).limit(limit);

  // Find all bootcamps
  const bootcamps = await query;

  // Pagination result
  const pagination = {};

  // If there is a previous page, add it to the pagination object
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  // If there is a next page, add it to the pagination object
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
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

// @desc    Get bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance/
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  // Get the zipcode, distance, and unit from the request parameters
  const { zipcode, distance } = req.params;

  // Get the latitude and longitude from the geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calculate the radius using radians
  // Divide distance by radius of Earth
  // Earth radius = 3,963 miles / 6,378 kilometers
  const radius = distance / 3963;

  // Find bootcamps within the radius
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  console.log('HERE');
  // Return a success message
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
