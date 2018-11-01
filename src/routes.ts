import { Express } from 'express';

import { router as echoRouter } from './echo/routes';

export default function (app: Express) {
  app.use('/echo', echoRouter);
}
