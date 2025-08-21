// Function to send success response
exports.send_success_response = (res, message, status_code = 200, data  = {}) => {
  res.status(status_code).json({
    success: true,
    message: message,
    data: data,
  });
};

// Function to send error response
exports.send_error_response = (res, error_message, status_code, extra = {}) => {
  res.status(status_code).json({
    success: false,
    error: error_message,
    ...extra,
  });
};