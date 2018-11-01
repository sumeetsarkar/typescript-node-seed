import { Router } from 'express';

import { requestWrapper } from '../utils/utils';
import { getIndex, getTwice } from './controller';

export const router = Router();

router.get('/', requestWrapper(getIndex));

router.get('/twice', requestWrapper(getTwice));
