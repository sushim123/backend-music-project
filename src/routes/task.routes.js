import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createTaskValidator,
  updateTaskValidator,
  taskIdParamValidator,
  filterTasksQueryValidator
} from '../validators/task.validator.js';

const router = Router();

// All task routes require authentication
router.use(authenticate);

router.post('/', createTaskValidator, validate, taskController.createTask);
router.get('/', filterTasksQueryValidator, validate, taskController.getAllTasks);
router.get('/:id', taskIdParamValidator, validate, taskController.getTaskById);
router.put('/:id', updateTaskValidator, validate, taskController.updateTask);
router.delete('/:id', taskIdParamValidator, validate, taskController.deleteTask);

export default router;
