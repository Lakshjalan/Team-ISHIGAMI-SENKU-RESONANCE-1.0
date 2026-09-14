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

export const getStats = async (req, res, next) => {
  try {
    const [
      { count: rawStudentsCount },
      { count: sourcesCount },
      { count: masterStudentsCount },
      { count: conflictQueueCount },
      { count: entityLinksCount }
    ] = await Promise.all([
      supabase.from('raw_students').select('*', { count: 'exact', head: true }),
      supabase.from('sources').select('*', { count: 'exact', head: true }),
      supabase.from('master_students').select('*', { count: 'exact', head: true }),
      supabase.from('student_conflict_queue').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
      supabase.from('student_entity_links').select('*', { count: 'exact', head: true })
    ]);

    res.json({
      total_ingested: rawStudentsCount || 0,
      total_sources: sourcesCount || 0,
      golden_master_entities: masterStudentsCount || 0,
      actionable_conflicts: conflictQueueCount || 0,
      entity_matches: entityLinksCount || 0
    });
  } catch (err) {
    next(err);
  }
};

export const runReconciliationPipeline = async (req, res, next) => {
  try {
    const { evaluateAndBlockCandidates } = await import('../services/blockingService.js');
    
    // Find all raw_students that haven't been processed yet
    const { data: linked } = await supabase.from('student_entity_links').select('raw_student_id');
    const { data: queued } = await supabase.from('student_conflict_queue').select('record_1_id, record_2_id');
    
    const processedIds = new Set();
    if (linked) linked.forEach(l => processedIds.add(l.raw_student_id));
    if (queued) queued.forEach(q => { processedIds.add(q.record_1_id); processedIds.add(q.record_2_id); });

    const { data: allRaw } = await supabase.from('raw_students').select('*');
    if (!allRaw) return res.json({ message: 'No records to process' });

    const unprocessedRecords = allRaw.filter(r => !processedIds.has(r.id));
    
    if (unprocessedRecords.length === 0) {
      return res.json({ message: 'No unprocessed records found.', conflicts_flagged: 0, auto_merged: 0, unique_promoted: 0 });
    }

    const blockingResult = await evaluateAndBlockCandidates(unprocessedRecords);

    await cacheService.del('api:entities:master');
    await cacheService.del('api:entities:audit:global');

    res.json({
      message: 'Reconciliation pipeline completed successfully',
      records_processed: unprocessedRecords.length,
      conflicts_flagged: blockingResult.conflicts_generated,
      auto_merged: blockingResult.auto_merged,
      unique_promoted: blockingResult.unique_promoted
    });
  } catch(err) {
    next(err);
  }
};
