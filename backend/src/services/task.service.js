import { Task } from '../models/mongo/Task.js';
import { Project } from '../models/mysql/index.js';
import { notFound, forbidden, badRequest } from '../utils/apiError.js';

export const createTask = async (userId, taskData) => {
  // Validate that the project exists and belongs to the authenticated user
  const project = await Project.findByPk(taskData.projectId);
  if (!project) {
    throw notFound(`Project with ID ${taskData.projectId} does not exist in MySQL.`);
  }

  if (project.userId !== userId) {
    throw forbidden('You can only create tasks for projects that you own.');
  }

  const task = await Task.create({
    title: taskData.title.trim(),
    description: taskData.description ? taskData.description.trim() : '',
    status: taskData.status || 'todo',
    priority: taskData.priority || 'medium',
    projectId: Number(taskData.projectId),
    userId,
    dueDate: taskData.dueDate || null
  });

  return task;
};

export const getTasks = async (userId, queryParams) => {
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(queryParams.limit, 10) || 10));
  const skip = (page - 1) * limit;

  // Build filter query scoped to the authenticated user
  const filter = { userId };

  if (queryParams.status) {
    filter.status = queryParams.status;
  }

  if (queryParams.priority) {
    filter.priority = queryParams.priority;
  }

  if (queryParams.projectId) {
    filter.projectId = Number(queryParams.projectId);
  }

  // Execute count and query in parallel
  const [totalRecords, tasks] = await Promise.all([
    Task.countDocuments(filter),
    Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  const totalPages = Math.ceil(totalRecords / limit) || 1;

  return {
    tasks,
    pagination: {
      totalRecords,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

export const getTaskById = async (userId, taskId) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw notFound(`Task with ID ${taskId} not found.`);
  }

  if (task.userId !== userId) {
    throw forbidden('You do not have permission to access this task.');
  }

  return task;
};

export const updateTask = async (userId, taskId, updateData) => {
  const task = await getTaskById(userId, taskId);

  if (updateData.title !== undefined) {
    task.title = updateData.title.trim();
  }
  if (updateData.description !== undefined) {
    task.description = updateData.description.trim();
  }
  if (updateData.status !== undefined) {
    task.status = updateData.status;
  }
  if (updateData.priority !== undefined) {
    task.priority = updateData.priority;
  }
  if (updateData.dueDate !== undefined) {
    task.dueDate = updateData.dueDate;
  }

  await task.save();
  return task;
};

export const deleteTask = async (userId, taskId) => {
  const task = await getTaskById(userId, taskId);
  await task.deleteOne();

  return { message: `Task ${taskId} deleted successfully.` };
};
