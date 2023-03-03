class AppError extends Error {
  constructor(message, statusCode, extraInfo = {}) {
    super(message);
    this.status = 'error';
    this.statusCode = statusCode;
    this.isOperational = true;
    this.extraInfo = extraInfo;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
