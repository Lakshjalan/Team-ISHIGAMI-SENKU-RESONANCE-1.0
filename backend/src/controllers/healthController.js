import { supabase } from '../config/supabase.js';

export const getHealthStatus = async (req, res, next) => {
  try {
    const startTime = Date.now();
    const { data, error } = await supabase.from('sources').select('count').limit(1);
    if (error) throw error;

    const dbLatencyMs = Date.now() - startTime;

    res.json({
      status: 'healthy',
      service: 'Veritas ER Backend API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptime_seconds: process.uptime(),
      memory_usage: process.memoryUsage(),
      dependencies: {
        database: { status: 'connected', latency_ms: dbLatencyMs }
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'unhealthy',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
};
