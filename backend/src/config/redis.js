import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Safe in-memory fallback map (ensures app never crashes if Redis isn't running)
const memoryCache = new Map();

let redis = null;

try {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    retryStrategy: () => null, // Don't block app if Redis is offline
    connectTimeout: 2000
  });

  redis.on('error', () => {
    // Silent fallback to memoryCache when Redis daemon isn't running locally
  });
} catch (e) {
  redis = null;
}

export const cacheService = {
  async get(key) {
    try {
      if (redis && redis.status === 'ready') {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
      }
    } catch (_) {}
    return memoryCache.get(key) || null;
  },

  async set(key, value, ttlSeconds = 3600) {
    try {
      if (redis && redis.status === 'ready') {
        await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return;
      }
    } catch (_) {}
    memoryCache.set(key, value);
  },

  async del(key) {
    try {
      if (redis && redis.status === 'ready') {
        await redis.del(key);
        return;
      }
    } catch (_) {}
    memoryCache.delete(key);
  },

  async flush() {
    try {
      if (redis && redis.status === 'ready') {
        await redis.flushdb();
        return;
      }
    } catch (_) {}
    memoryCache.clear();
  }
};
