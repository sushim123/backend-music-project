import * as dashboardService from '../services/dashboard.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getDashboardStats(req.user.id);
    return sendSuccess(res, 'Dashboard statistics retrieved successfully.', stats, 200);
  } catch (error) {
    next(error);
  }
};
