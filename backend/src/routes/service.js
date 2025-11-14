import { Router } from 'express';
import {
  createServiceRequest,
  getProgressByKey,
  getWhatsAppNumber,
  updateWhatsAppNumber,
  listServiceContracts,
  startServiceContract,
  updateServiceContractStatus,
} from '../controllers/serviceController.js';

const router = Router();

router.get('/contact', getWhatsAppNumber);
router.post('/contact', updateWhatsAppNumber);

router.post('/request', createServiceRequest);
router.get('/progress/:uniqueKey', getProgressByKey);

router.get('/contracts', listServiceContracts);
router.post('/contracts/:id/start', startServiceContract);
router.patch('/contracts/:id/status', updateServiceContractStatus);

export default router;

