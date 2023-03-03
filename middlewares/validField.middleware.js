const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

exports.validFields = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new AppError('Check body error', 400, { errors: errors.mapped() })
    );
  }
  next();
};
