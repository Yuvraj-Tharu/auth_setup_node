import { Router } from 'express';
import UserController from '../controller/user_controller';
import {
  changePasswordValidator,
  createUserValidator,
  loginUserValidator,
  refreshTokenValidator,
  updateUserValidator,
} from '../validator/user_validator';
import { validateSchema, checkValidId } from '../../helper/validation_helper';
import { authenticateToken, checkRole } from '@middleware/auth';

const router = Router();

router.post(
  '/',
  validateSchema(createUserValidator),
  UserController.createUser,
);

router.post(
  '/login',
  validateSchema(loginUserValidator),
  UserController.loginUser,
);

router.post(
  '/refresh-token',
  validateSchema(refreshTokenValidator),
  UserController.refreshToken,
);

router.put(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  validateSchema([checkValidId('id'), ...updateUserValidator]),
  UserController.updateUser,
);

router.get(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  validateSchema([checkValidId('id')]),
  UserController.getUserById,
);

router.delete(
  '/:id',
  authenticateToken,
  checkRole(['superadmin']),
  validateSchema([checkValidId('id')]),
  UserController.deleteUser,
);

router.get(
  '/',
  authenticateToken,
  checkRole(['superadmin']),
  UserController.getUsers,
);

router.post(
  '/change-password',
  authenticateToken,
  validateSchema(changePasswordValidator),
  UserController.changePassword,
);

export default router;
