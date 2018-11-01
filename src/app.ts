import express from 'express';
import path from 'path';
import morgan from 'morgan';

import logger, { loggerStream } from './utils/logger';
import security from './middlewares/security';
import errorHandler from './middlewares/error-handler';
import transformations from './middlewares/transformations';
import statics from './middlewares/statics';
import routes from './routes';
import { CONSTANTS } from './utils/constants';

// Setup Logger
if (process.env.NODE_ENV !== 'production') {
  logger.info(`Logger setup... ${CONSTANTS.appName}`);
}

// Initialize express instance
const app = express();

// Setup Express
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// Setup compression, body/ cookie parsers
transformations(app);

// Setup Security
security(app);

// Setup morgan with winston logger stream
app.use(morgan('tiny', { stream: loggerStream }));

// Setup statics
statics(app);

// Setup routes
routes(app);

// Setup error handler
errorHandler(app);

export default app;
