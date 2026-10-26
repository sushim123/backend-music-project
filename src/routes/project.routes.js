import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createProjectValidator,
  updateProjectValidator,
  projectIdParamValidator
} from '../validators/project.validator.js';

const router = Router();


router.use(authenticate);

router.post('/', createProjectValidator, validate, projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/:id', projectIdParamValidator, validate, projectController.getProjectById);
router.put('/:id', updateProjectValidator, validate, projectController.updateProject);
router.delete('/:id', projectIdParamValidator, validate, projectController.deleteProject);

export default router;
