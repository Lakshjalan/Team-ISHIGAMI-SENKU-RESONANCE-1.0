import { supabase } from '../config/supabase.js';
import { cacheService } from '../config/redis.js';
import { verifyHashLedgerChain } from '../services/auditService.js';

export const getMasterEntities = async (req, res, next) => {
  const cacheKey = 'api:entities:master';
  const cached = await cacheService.get(cacheKey);
  if (cached) return res.json({ master_students: cached, cache: 'HIT' });

  try {
    const { data, error } = await supabase.from('master_students').select('*').order('created_at', { ascending: false });
    if (error) throw error;

    await cacheService.set(cacheKey, data, 300);
    res.json({ master_students: data, cache: 'MISS' });
  } catch (err) {
    next(err);
  }
};

export const getAuditTrail = async (req, res, next) => {
  const cacheKey = `api:entities:audit:${req.params.id}`;
  const cached = await cacheService.get(cacheKey);
  if (cached) return res.json({ audit_trail: cached, cache: 'HIT' });

  try {
    const { data, error } = await supabase
      .from('student_audit_ledger')
      .select('*')
      .eq('master_student_id', req.params.id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    await cacheService.set(cacheKey, data, 600);
    res.json({ audit_trail: data, cache: 'MISS' });
  } catch (err) {
    next(err);
  }
};

export const getGlobalAuditTrail = async (req, res, next) => {
  const cacheKey = 'api:entities:audit:global';
  const cached = await cacheService.get(cacheKey);
  if (cached) return res.json({ audit_trail: cached, cache: 'HIT' });

  try {
    const { data, error } = await supabase
      .from('student_audit_ledger')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    await cacheService.set(cacheKey, data, 60);
    res.json({ audit_trail: data, cache: 'MISS' });
  } catch (err) {
    next(err);
  }
};

export const verifyLedgerIntegrity = async (req, res, next) => {
  try {
    const result = await verifyHashLedgerChain();
    res.json(result);
  } catch (err) {
    next(err);
  }
};
