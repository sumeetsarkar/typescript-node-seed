import { Request, Response, NextFunction } from 'express';
import { responsePromise } from '../utils/utils';

export function getIndex(req: Request, res: Response, next: NextFunction) {
  return res.status(200).send({ ...req.query });
}

export function getTwice(req: Request, res: Response, next: NextFunction) {
  return responsePromise(res)({ response: { ...req.query }, statusCode: 200 });
}
