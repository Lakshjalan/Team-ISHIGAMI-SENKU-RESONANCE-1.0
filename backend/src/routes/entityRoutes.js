import express from 'express';
import { getMasterEntities, getAuditTrail, getGlobalAuditTrail, verifyLedgerIntegrity, getStats } from '../controllers/entityController.js';

const router = express.Router();

router.get('/stats', getStats);
router.get('/master', getMasterEntities);
router.get('/verify-ledger', verifyLedgerIntegrity);
router.get('/audit', getGlobalAuditTrail);
router.get('/:id/audit', getAuditTrail);

export default router;
