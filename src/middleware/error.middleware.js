import { sendError } from '../utils/apiResponse.js';

export const notFoundHandler = (req, res, next) => {
  return sendError(res, `Cannot ${req.method} ${req.originalUrl} - Route not found`, null, 404);
};

export const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Application Error:', err);

  // Sequelize Unique Constraint Error (e.g. duplicate email)
  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors ? err.errors.map(e => ({ field: e.path, message: e.message })) : null;
    return sendError(res, 'A record with this information already exists.', errors, 409);
  }

  // Sequelize Validation Error
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors ? err.errors.map(e => ({ field: e.path, message: e.message })) : null;
    return sendError(res, 'Database validation failed.', errors, 400);
  }

  // Mongoose Cast Error (Invalid Mongo ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return sendError(res, `Invalid resource ID format: '${err.value}'`, null, 400);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors || {}).map(e => ({
      field: e.path,
      message: e.message
    }));
    return sendError(res, 'Data validation failed.', errors, 400);
  }

  // Bad JSON payload syntax error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(res, 'Invalid JSON payload received.', null, 400);
  }

  // Custom errors with explicit status code
  if (err.statusCode) {
    return sendError(res, err.message, err.errors || null, err.statusCode);
  }

  // General server error
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  return sendError(res, message, null, 500);
};
