import { body } from 'express-validator';
import User from '../model/user_model';

const emailUniqueCheck = async (email: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }
};

const createUserValidator = [
  body('name').notEmpty().withMessage('Name is required').bail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .bail()
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .bail()
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one symbol'),

  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .bail()
    .custom(emailUniqueCheck),
  body('role')
    .isIn(['user', 'superadmin'])
    .withMessage('Role must be user or superadmin'),
];

const updateUserValidator = [
  body('name').optional().notEmpty().withMessage('Name is required').bail(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email address')
    .bail()
    .custom(emailUniqueCheck),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .bail()
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .bail()
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one symbol'),

  body('role')
    .optional()
    .isIn(['user', 'superadmin'])
    .withMessage('Role must be user or superadmin'),
];

const loginUserValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

const refreshTokenValidator = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .bail()
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .bail()
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one symbol'),
];

export {
  createUserValidator,
  updateUserValidator,
  loginUserValidator,
  refreshTokenValidator,
};
