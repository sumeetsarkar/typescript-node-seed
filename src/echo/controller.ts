import { Request, Response, NextFunction } from 'express';
import { responsePromise } from '../utils/utils';
import redisClient from '../clients/redis-client';

export async function getIndex(req: Request, res: Response, next: NextFunction) {
  return res.status(200).send({ ...req.query });
}

export async function getTwice(req: Request, res: Response, next: NextFunction) {
  const data = Object.keys(req.query)
    .reduce(
      (acc: any, k, i) => {
        acc[k] = req.query[k] + req.query[k];
        return acc;
      },
      {});
  return responsePromise(res)({ response: data, statusCode: 200 });
}

export async function getCount(req: Request, res: Response) {
  const count = await redisClient.getAsync('count');
  const newCount = parseInt(count || 0, 10) + 1;
  await redisClient.set('count', `${newCount}`);
  return responsePromise(res)({ response: { count }, statusCode: 200 });
}
