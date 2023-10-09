import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import { invalidDataError, notFoundError } from '@/errors';

export function validateBody<T>(schema: ObjectSchema<T>): ValidationMiddleware {
  return validate(schema, 'body');
}

export function validateParams<T>(schema: ObjectSchema<T>): ValidationMiddleware {
  return validate(schema, 'params');
}

export function validateBooking<T>(schema: ObjectSchema<T>): ValidationMiddleware {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req['body'], {
      abortEarly: false,
    });

    if (!error) {
      next();
    } else {
      throw notFoundError();
    }
  };
};

function validate(schema: ObjectSchema, type: 'body' | 'params') {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[type], {
      abortEarly: false,
    });

    if (!error) {
      next();
    } else {
      let errorMessage = '';
      error.details.forEach((d) => (errorMessage += d.message + ' '));
      throw invalidDataError(errorMessage);
    }
  };
}

type ValidationMiddleware = (req: Request, res: Response, next: NextFunction) => void;
