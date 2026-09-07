import express from 'express';
import { getMasterEntities, getAuditTrail, verifyLedgerIntegrity } from '../controllers/entityController.js';

const router = express.Router();

router.get('/master', getMasterEntities);
router.get('/verify-ledger', verifyLedgerIntegrity);
router.get('/:id/audit', getAuditTrail);

export default router;
