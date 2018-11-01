import express from 'express';
import { Request, Response, NextFunction, Errback } from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import helmet from 'helmet';
import expressValidator from 'express-validator';
import morgan from 'morgan';
import expressRateLimit from 'express-rate-limit';

import { ExtendedError } from './utils/error-handler';
import routes from './routes';
import * as CacheOptions from './utils/cache-options';
import logger, { loggerStream } from './utils/logger';
import { CONSTANTS } from './utils/constants';
import { HTTP_ERR_NOT_FOUND, HTTP_ERR_INTERNAL_ERROR } from './utils/error-codes';

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

// only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
app.enable('trust proxy');

const limiter = new expressRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

// Setup compression, body/ cookie parsers
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setup morgan with winston logger stream
app.use(morgan('tiny', { stream: loggerStream }));

// Setup Security
app.use(expressValidator());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: 'sameorigin' }));
app.use(helmet.permittedCrossDomainPolicies());

// Setup Cache options
app.use(express.static(path.join(__dirname, 'public'), CacheOptions.staticOptions));

// Setup routes
routes(app);

// Handle unkown routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ExtendedError('Route Not Found', HTTP_ERR_NOT_FOUND));
});

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

export default app;
