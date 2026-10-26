import { body, param, query } from 'express-validator';
import mongoose from 'mongoose';

export const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim(),
  body('status')
    .optional()
    .trim()
    .isIn(['todo', 'in_progress', 'completed'])
    .withMessage('Status must be todo, in_progress, or completed'),
  body('priority')
    .optional()
    .trim()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('projectId')
    .notEmpty().withMessage('Project ID is required')
    .isInt({ gt: 0 }).withMessage('Project ID must be a valid positive integer'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date string')
];

export const updateTaskValidator = [
  param('id')
    .custom(val => mongoose.Types.ObjectId.isValid(val))
    .withMessage('Invalid task ID format. Must be a 24-character hexadecimal string'),
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
    .isIn(['todo', 'in_progress', 'completed'])
    .withMessage('Status must be todo, in_progress, or completed'),
  body('priority')
    .optional()
    .trim()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date string')
];

export const taskIdParamValidator = [
  param('id')
    .custom(val => mongoose.Types.ObjectId.isValid(val))
    .withMessage('Invalid task ID format. Must be a 24-character hexadecimal string')
];

export const filterTasksQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer starting at 1'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['todo', 'in_progress', 'completed'])
    .withMessage('Status filter must be todo, in_progress, or completed'),
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority filter must be low, medium, or high'),
  query('projectId')
    .optional()
    .isInt({ gt: 0 }).withMessage('projectId filter must be a positive integer')
];
