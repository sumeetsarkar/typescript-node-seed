import { Express, Request, Response, NextFunction } from 'express';

import { ExtendedError } from '../utils/error-handler';
import { HTTP_ERR_NOT_FOUND, HTTP_ERR_INTERNAL_ERROR } from '../utils/error-codes';
import logger from '../utils/logger';

export default function (app: Express) {
  // Handle unkown routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new ExtendedError('Route Not Found', HTTP_ERR_NOT_FOUND));
  });

  // Express error handler
  app.use((err: ExtendedError, req: Request, res: Response, next: NextFunction) => {
    logger.error('Some error occured');
    logger.error(`status: ${err.status} message: ${err.message}`);
    logger.error(err.stack);
    res.status(err.status || HTTP_ERR_INTERNAL_ERROR);
    res.send({
      code: err.status || HTTP_ERR_INTERNAL_ERROR,
      status: 'Failure',
      message: err.message || 'Something went wrong',
    });
  });
}
