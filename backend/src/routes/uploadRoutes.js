import express from 'express';
import multer from 'multer';
import { handleUpload, handleFileUpload } from '../controllers/uploadController.js';
import { validateRequest } from '../middleware/validator.js';
import { uploadSchema } from '../schemas/uploadSchema.js';
import { supabase } from '../config/supabase.js';
import { cacheService } from '../config/redis.js';

const router = express.Router();

// Memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

router.post('/', validateRequest(uploadSchema), handleUpload);
router.post('/file', upload.single('file'), handleFileUpload);

router.get('/', async (req, res, next) => {
  const cacheKey = 'api:sources';
  const cached = await cacheService.get(cacheKey);
  if (cached) return res.json({ sources: cached, cache: 'HIT' });

  try {
    const { data, error } = await supabase.from('sources').select('*').order('created_at', { ascending: false });
    if (error) throw error;

    await cacheService.set(cacheKey, data, 300);
    res.json({ sources: data, cache: 'MISS' });
  } catch (err) {
    next(err);
  }
});

export default router;
