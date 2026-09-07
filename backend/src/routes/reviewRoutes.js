import express from 'express';
import { getReviewQueue, resolveConflict } from '../controllers/reviewController.js';
import { validateRequest } from '../middleware/validator.js';
import { resolveConflictSchema } from '../schemas/reviewSchema.js';

const router = express.Router();

router.get('/queue', getReviewQueue);
router.post('/resolve', validateRequest(resolveConflictSchema), resolveConflict);

export default router;
