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

    // Check if ML failed — surface the error to the frontend
    if (blockingResult.ml_status && blockingResult.ml_status !== 'OK' && blockingResult.ml_status !== 'skipped') {
      return res.status(500).json({
        message: `ML Engine failure: ${blockingResult.ml_status}`,
        ml_error: blockingResult.ml_error,
        records_processed: 0,
        conflicts_flagged: 0,
        auto_merged: 0,
        unique_promoted: 0
      });
    }

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

export const checkMLHealth = async (req, res) => {
  const { spawnSync } = await import('child_process');
  const path = await import('path');
  const fs = await import('fs');

  const possiblePaths = [
    path.resolve(process.cwd(), 'ml/src/predict_batch.py'),
    path.resolve(process.cwd(), '../ml/src/predict_batch.py')
  ];
  const mlScriptPath = possiblePaths.find(p => fs.existsSync(p));

  const pythonBins = [
    process.env.PYTHON_BIN,
    process.platform === 'win32' ? 'python' : 'python3',
    process.platform === 'win32' ? 'python3' : 'python'
  ].filter(Boolean);

  const checks = {
    script_found: !!mlScriptPath,
    script_path: mlScriptPath || 'NOT FOUND',
    python_available: false,
    python_bin: null,
    model_loadable: false,
    test_prediction: null
  };

  // Test Python availability
  for (const pyBin of pythonBins) {
    try {
      const r = spawnSync(pyBin, ['--version'], { encoding: 'utf8', timeout: 5000 });
      if (r && !r.error) {
        checks.python_available = true;
        checks.python_bin = `${pyBin} (${r.stdout?.trim() || r.stderr?.trim()})`;
        break;
      }
    } catch { /* next */ }
  }

  // Test ML prediction with a simple pair
  if (mlScriptPath && checks.python_available) {
    const testInput = JSON.stringify([{
      record1: { name: 'Test A', email: 'a@test.com', phone_number: '1234567890', branch: 'CSE', course: 'B.Tech', dob: '2000-01-01', reg_no: 'X001' },
      record2: { name: 'Test A', email: 'a@test.com', phone_number: '1234567890', branch: 'CSE', course: 'B.Tech', dob: '2000-01-01', reg_no: 'X001' }
    }]);

    const pyBin = process.env.PYTHON_BIN || (process.platform === 'win32' ? 'python' : 'python3');
    const r = spawnSync(pyBin, [mlScriptPath], { input: testInput, encoding: 'utf8', timeout: 30000 });

    if (r && !r.error) {
      try {
        const pred = JSON.parse(r.stdout);
        checks.model_loadable = true;
        checks.test_prediction = pred[0];
      } catch {
        checks.test_prediction = `PARSE_ERROR: ${r.stdout?.substring(0, 200)}`;
      }
    } else {
      checks.test_prediction = `EXEC_ERROR: ${r?.error?.message}`;
    }
  }

  const healthy = checks.script_found && checks.python_available && checks.model_loadable;
  res.status(healthy ? 200 : 503).json({ healthy, ...checks });
};

