import { Project } from '../models/mysql/index.js';
import { Task } from '../models/mongo/Task.js';

export const getDashboardStats = async (userId) => {
  // Query MySQL for project statistics
  const [totalProjects, activeProjects, completedProjects] = await Promise.all([
    Project.count({ where: { userId } }),
    Project.count({ where: { userId, status: 'active' } }),
    Project.count({ where: { userId, status: 'completed' } })
  ]);

  // Query MongoDB for task statistics
  const [totalTasks, pendingTasks, completedTasks, highPriorityTasks] = await Promise.all([
    Task.countDocuments({ userId }),
    Task.countDocuments({ userId, status: { $in: ['todo', 'in_progress'] } }),
    Task.countDocuments({ userId, status: 'completed' }),
    Task.countDocuments({ userId, priority: 'high' })
  ]);

  return {
    projects: {
      total: totalProjects,
      active: activeProjects,
      completed: completedProjects
    },
    tasks: {
      total: totalTasks,
      pending: pendingTasks,
      completed: completedTasks,
      highPriority: highPriorityTasks
    },
    // Flattened summary exactly matching assessment list
    summary: {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      pendingTasks,
      completedTasks,
      highPriorityTasks
    }
  };
};
