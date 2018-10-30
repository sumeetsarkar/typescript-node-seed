import express from 'express';
import { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import path from 'path';
import helmet from 'helmet';
import expressValidator from 'express-validator';

import * as CacheOptions from './utils/cache-options';
import logger from './utils/logger';
import { CONSTANTS } from './utils/constants';

// Setup Logger
if (process.env.NODE_ENV !== 'production') {
  logger.debug('Logging initialized at debug level', CONSTANTS.appName);
  logger.info('Logging initialized at info level', CONSTANTS.appName);
  logger.warn('Logging initialized at warn level', CONSTANTS.appName);
  logger.debug('Logging initialized at debug level', CONSTANTS.appName);
  logger.error('Logging initialized at error level', CONSTANTS.appName);
  logger.verbose('Logging initialized at verbose level', CONSTANTS.appName);
}

const app = express();

// Setup Express
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup Security
app.use(expressValidator());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: 'sameorigin' }));
app.use(helmet.permittedCrossDomainPolicies());

// Setup Cache options
app.use(express.static(path.join(__dirname, 'public'), CacheOptions.staticOptions));
