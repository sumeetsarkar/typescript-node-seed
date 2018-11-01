import { Router } from 'express';

import { WRAP } from '../utils/utils';
import { getEcho } from './controller';

export const router = Router();

router.get('/', WRAP(getEcho));
