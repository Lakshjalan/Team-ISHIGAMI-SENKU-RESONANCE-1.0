import { cacheService } from '../config/redis.js';

export const rateLimiter = (options = { windowMs: 60 * 1000, max: 100 }) => {
  const memoryStore = new Map();

  return async (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const key = `ratelimit:${ip}`;
    const now = Date.now();

    try {
      const cached = await cacheService.get(key);
      const current = cached ? cached.count : 0;

      if (current >= options.max) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: `Too many requests from IP ${ip}. Maximum allowed is ${options.max} requests per ${options.windowMs / 1000}s.`,
          retry_after_seconds: Math.ceil(options.windowMs / 1000)
        });
      }

      await cacheService.set(key, { count: current + 1, resetAt: now + options.windowMs }, Math.ceil(options.windowMs / 1000));
      next();
    } catch (_) {
      // Memory fallback if Redis unavailable
      const record = memoryStore.get(ip) || { count: 0, resetTime: now + options.windowMs };
      if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + options.windowMs;
      } else {
        record.count++;
      }
      memoryStore.set(ip, record);

      if (record.count > options.max) {
        return res.status(429).json({ error: 'Rate limit exceeded', message: 'Too many requests.' });
      }
      next();
    }
  };
};
