import { check } from 'express-validator';

export const contactUsValidationRules = [
  check('name').notEmpty().withMessage('Name is required'),
  check('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isNumeric()
    .withMessage('Phone number must be numeric')
    .isLength({ min: 10, max: 15 })
    .withMessage('Phone number must be between 10 and 15 digits'),
  check('address').notEmpty().withMessage('Address is required'),
  check('message').optional().notEmpty().withMessage('Message is required'),
];

export const updateStatus = [
  check('status')
    .optional()
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'followed-up'])
    .withMessage('Status must be either pending, or followed-up'),
  check('followUpNote')
    .optional()
    .notEmpty()
    .withMessage('Follow up note is required')
    .bail(),
];
