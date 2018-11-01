import { Request, Response, NextFunction } from 'express';
import { responsePromise } from '../utils/utils';

export function getIndex(req: Request, res: Response, next: NextFunction) {
  return res.status(200).send({ ...req.query });
}

export function getTwice(req: Request, res: Response, next: NextFunction) {
  const data = Object.keys(req.query)
    .reduce(
      (acc: any, k, i) => {
        acc[k] = req.query[k] + req.query[k];
        return acc;
      },
      {});
  return responsePromise(res)({ response: data, statusCode: 200 });
}
