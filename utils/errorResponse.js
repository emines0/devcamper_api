class ErrorResponse extends Error {
  // $message  - to be able to send an error message
  // $statusCode - to be able to send/change a status code

  constructor(message, statusCode) {
    // Call the constructor of the parent class
    // $message - passing our message to the parent class
    super(message);
    // $statusCode - passing our status code to the parent class
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
