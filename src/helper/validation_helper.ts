import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, param } from 'express-validator';
import mongoose from 'mongoose';

type ErrorDetail = {
  message: string;
  errors: any[];
  statusCode: number;
};

const error = async (
  message: string,
  statusCode: number,
  errors: any[],
): Promise<ErrorDetail> => {
  return {
    message,
    statusCode,
    errors,
  };
};

const validateSchema = (validations: ValidationChain[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const validationError = await error(
      'The request failed due to a validation problem',
      422,
      errors.array(),
    );

    res.status(422).json(validationError);
  };
};

const checkValidId = (field: string) => {
  return param(field)
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid ID format');
};

export { validateSchema, checkValidId };
