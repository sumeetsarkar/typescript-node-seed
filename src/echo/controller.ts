import { Request, Response, NextFunction } from 'express';
import { RESPONSE_HELPER } from '../utils/utils';

export const getEcho = function (req: Request, res: Response, next: NextFunction) {
  // return res.status(200).send({ ...req.query });
  return RESPONSE_HELPER(res)({ response: { ...req.query }, statusCode: 200 });
};
