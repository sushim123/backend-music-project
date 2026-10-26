import * as projectService from '../services/project.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createProject = async (req, res, next) => {
  try {
    const project = await projectService.createProject(req.user.id, req.body);
    return sendSuccess(res, 'Project created successfully.', { project }, 201);
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getUserProjects(req.user.id);
    return sendSuccess(res, 'Projects retrieved successfully.', { count: projects.length, projects }, 200);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.user.id, req.params.id);
    return sendSuccess(res, 'Project retrieved successfully.', { project }, 200);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await projectService.updateProject(req.user.id, req.params.id, req.body);
    return sendSuccess(res, 'Project updated successfully.', { project }, 200);
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const result = await projectService.deleteProject(req.user.id, req.params.id);
    return sendSuccess(res, result.message, null, 200);
  } catch (error) {
    next(error);
  }
};
