// @desc   Get all bootcamps
// @route  GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, message: "Show all bootcamps" });
};

// @desc   Get singe bootcamp
// @route  GET /api/v1/:id
// @access Public
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: `Show bootcamp ${req.params.id}` });
};

// @desc   Create a new bootcamp
// @route  POST /api/v1/
// @access Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: "Create new bootcamp" });
};

// @desc   Update bootcamp
// @route  PUT /api/v1/:id
// @access Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: `Update bootcamp ${req.params.id}` });
};

// @desc   Delete bootcamp
// @route  DELETE /api/v1/:id
// @access Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: `Delete bootcamp ${req.params.id}` });
};
