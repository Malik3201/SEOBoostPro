import { Router } from 'express';

import auditRouter from './audit.js';
import reportRouter from './report.js';
import adminRouter from './admin.js';
import serviceRouter from './service.js';

const router = Router();

router.use('/audit', auditRouter);
router.use('/report', reportRouter);
router.use('/admin', adminRouter);
router.use('/service', serviceRouter);

export default router;

