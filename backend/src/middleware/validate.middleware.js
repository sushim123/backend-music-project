import { validationResult } from 'express-validator';
import { sendError } from '../utils/apiResponse.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));
    return sendError(res, 'Validation failed. Please check input fields.', formattedErrors, 400);
  }
  next();
};
