import { body, param } from 'express-validator';

export const createProjectValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Project title is required')
    .isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('status')
    .optional()
    .trim()
    .isIn(['active', 'completed', 'archived'])
    .withMessage('Status must be active, completed, or archived')
];

export const updateProjectValidator = [
  param('id')
    .isInt({ gt: 0 }).withMessage('Project ID must be a valid positive integer'),
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty')
    .isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('status')
    .optional()
    .trim()
    .isIn(['active', 'completed', 'archived'])
    .withMessage('Status must be active, completed, or archived')
];

export const projectIdParamValidator = [
  param('id')
    .isInt({ gt: 0 }).withMessage('Project ID must be a valid positive integer')
];
