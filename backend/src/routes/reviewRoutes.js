import express from 'express';
import { getReviewQueue, resolveConflict, distributeConflicts } from '../controllers/reviewController.js';
import { validateRequest } from '../middleware/validator.js';
import { resolveConflictSchema } from '../schemas/reviewSchema.js';

const router = express.Router();

router.get('/queue', getReviewQueue);
router.post('/resolve', validateRequest(resolveConflictSchema), resolveConflict);
router.post('/distribute', distributeConflicts);

export default router;
