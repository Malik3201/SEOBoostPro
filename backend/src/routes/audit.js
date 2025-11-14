import { Router } from 'express';
import { handleAudit } from '../controllers/auditController.js';

const router = Router();

router.post('/', handleAudit);

export default router;

