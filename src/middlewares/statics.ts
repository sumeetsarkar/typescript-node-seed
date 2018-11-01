import path from 'path';
import express, { Express } from 'express';

import * as CacheOptions from '../utils/cache-options';

export default function (app: Express) {
  app.use(express.static(path.join(__dirname, 'public'), CacheOptions.staticOptions));
}
