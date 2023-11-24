const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  // Make a copy of the error object
  let error = { ...err };

  // Make the copy of message from err object
  error.message = err.message;

  // Log to console for dev (whole error)
  console.log(err.stack.red);

  // Log to console for dev (just the name of the error)
  console.log(err.name);

  if (err.name === 'CastError') {
    const message = `Bootcamp not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
