import * as taskService from '../services/task.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.id, req.body);
    return sendSuccess(res, 'Task created successfully.', { task }, 201);
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const result = await taskService.getTasks(req.user.id, req.query);
    return sendSuccess(res, 'Tasks retrieved successfully.', result, 200);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.user.id, req.params.id);
    return sendSuccess(res, 'Task retrieved successfully.', { task }, 200);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
    return sendSuccess(res, 'Task updated successfully.', { task }, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const result = await taskService.deleteTask(req.user.id, req.params.id);
    return sendSuccess(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
};
