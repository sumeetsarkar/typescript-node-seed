import { Express } from 'express';
import helmet from 'helmet';
import expressValidator from 'express-validator';
import expressRateLimit from 'express-rate-limit';

export default function (app: Express) {
  // Only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.enable('trust proxy');

  const limiter = new expressRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });

  //  apply to all requests
  app.use(limiter);

  // Validate requests
  app.use(expressValidator());

  // Helmet security policies
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.frameguard({ action: 'sameorigin' }));
  app.use(helmet.permittedCrossDomainPolicies());
}
