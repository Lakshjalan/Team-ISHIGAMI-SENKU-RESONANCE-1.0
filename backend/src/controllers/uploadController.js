import { supabase } from '../config/supabase.js';
import { cacheService } from '../config/redis.js';
import { normalizeRecord } from '../services/normalizationServices.js';
import { evaluateAndBlockCandidates } from '../services/blockingService.js';
import Papa from 'papaparse';

export const handleUpload = async (req, res, next) => {
  try {
    const { source_name, reliability_score = 0.85, records } = req.body;

    let { data: source, error: srcFetchErr } = await supabase
      .from('sources')
      .select('*')
      .eq('source_name', source_name)
      .single();

    if (srcFetchErr && srcFetchErr.code !== 'PGRST116') {
      throw srcFetchErr;
    }

    if (!source) {
      const { data: newSource, error: srcInsertErr } = await supabase
        .from('sources')
        .insert([{ source_name, reliability_score }])
        .select()
        .single();

      if (srcInsertErr) throw srcInsertErr;
      source = newSource;
    }

    const rows = records.map((r) => {
      const normPayload = normalizeRecord(r);
      return {
        source_id: source.id,
        reg_no: r.reg_no || null,
        name: r.name || 'UNKNOWN',
        email: r.email || null,
        phone_number: r.phone_number || r.phone || null,
        branch: r.branch || null,
        course: r.course || null,
        dob: r.dob || null,
        raw_payload: r,
        normalized_payload: normPayload
      };
    });

    const { data: insertedRecords, error: insertErr } = await supabase
      .from('raw_students')
      .insert(rows)
      .select();

    if (insertErr) throw insertErr;

    // Cache normalization lookups in Redis
    for (const rec of insertedRecords) {
      await cacheService.set(`norm:record:${rec.id}`, rec.normalized_payload, 86400);
    }

    // Run automated candidate blocking & conflict triage engine
    const blockingResult = await evaluateAndBlockCandidates(insertedRecords);

    // Invalidate Redis caches
    await cacheService.del('api:sources');
    await cacheService.del('api:review:queue');

    res.status(201).json({
      message: 'Ingestion successful',
      source_id: source.id,
      records_ingested: insertedRecords.length,
      conflicts_flagged: blockingResult.conflicts_generated,
      auto_merged: blockingResult.auto_merged,
      unique_promoted: blockingResult.unique_promoted,
      redis_cached: true
    });
  } catch (err) {
    next(err);
  }
};

export const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please attach a CSV or JSON file.' });
    }

    const sourceName = req.body.source_name || req.file.originalname.replace(/\.[^/.]+$/, '');
    const reliabilityScore = parseFloat(req.body.reliability_score || '0.85');
    const fileContent = req.file.buffer.toString('utf8');

    let parsedRecords = [];

    if (req.file.originalname.endsWith('.json') || req.file.mimetype.includes('json')) {
      parsedRecords = JSON.parse(fileContent);
      if (!Array.isArray(parsedRecords)) {
        parsedRecords = [parsedRecords];
      }
    } else {
      // Parse CSV using PapaParse
      const parseResult = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
      });
      parsedRecords = parseResult.data;
    }

    if (!parsedRecords || parsedRecords.length === 0) {
      return res.status(400).json({ error: 'Uploaded file is empty or could not be parsed.' });
    }

    // Pass parsed records to handleUpload pipeline
    req.body = {
      source_name: sourceName,
      reliability_score: reliabilityScore,
      records: parsedRecords
    };

    return handleUpload(req, res, next);
  } catch (err) {
    next(err);
  }
};
