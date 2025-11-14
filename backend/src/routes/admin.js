import { Router } from 'express';
import { listAdmins } from '../controllers/adminController.js';

const router = Router();

router.get('/list', listAdmins);

export default router;
