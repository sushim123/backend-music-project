/**
 * Functional Custom Error Creator
 * Returns standard Error instances with attached statusCode and optional errors
 */

export const createError = (statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (errors) {
    error.errors = errors;
  }
  return error;
};

export const badRequest = (message = 'Bad Request', errors = null) => createError(400, message, errors);
export const unauthorized = (message = 'Unauthorized access') => createError(401, message);
export const forbidden = (message = 'Forbidden access') => createError(403, message);
export const notFound = (message = 'Resource not found') => createError(404, message);
export const conflict = (message = 'Conflict occurred') => createError(409, message);
export const internalError = (message = 'Internal server error') => createError(500, message);
