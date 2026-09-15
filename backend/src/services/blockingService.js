import { supabase } from '../config/supabase.js';
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateHashEntry } from './auditService.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------------------------------------------------------
// Architecture-aligned confidence thresholds (architecture.md §5)
// ---------------------------------------------------------------------------
const THRESHOLD_AUTO_MERGE = 0.90;  // >= 0.90: Auto-merge into Golden Record
const THRESHOLD_REVIEW     = 0.60;  // >= 0.60: Send to human review queue
                                     // <  0.60: Keep as distinct entity

// ---------------------------------------------------------------------------
// Helper: Map a Supabase raw_students row to the flat shape ML expects
// ---------------------------------------------------------------------------
function toMLRecord(dbRow) {
  return {
    reg_no:       dbRow.reg_no       || '',
    name:         dbRow.name         || '',
    email:        dbRow.email        || '',
    phone_number: dbRow.phone_number || '',
    branch:       dbRow.branch       || '',
    course:       dbRow.course       || '',
    dob:          dbRow.dob          || ''
  };
}

// ---------------------------------------------------------------------------
// Helper: Pick the field value from the record whose source has higher
// reliability. Falls back to first-non-null if reliability data missing.
// ---------------------------------------------------------------------------
function pickByReliability(rec1, rec2, field, sourceReliabilities) {
  const val1 = rec1[field];
  const val2 = rec2[field];

  // If only one has a value, use that
  if (val1 && !val2) return val1;
  if (!val1 && val2) return val2;
  if (!val1 && !val2) return null;

  // Both have values — pick by source reliability
  const reliability1 = sourceReliabilities.get(rec1.source_id) ?? 0.5;
  const reliability2 = sourceReliabilities.get(rec2.source_id) ?? 0.5;

  return reliability1 >= reliability2 ? val1 : val2;
}

// ---------------------------------------------------------------------------
// Build golden record payload using reliability-weighted field selection
// ---------------------------------------------------------------------------
function buildGoldenPayload(rec1, rec2, confidenceScore, sourceReliabilities) {
  return {
    golden_reg_no:       pickByReliability(rec1, rec2, 'reg_no', sourceReliabilities),
    golden_name:         pickByReliability(rec1, rec2, 'name', sourceReliabilities),
    golden_email:        pickByReliability(rec1, rec2, 'email', sourceReliabilities),
    golden_phone_number: pickByReliability(rec1, rec2, 'phone_number', sourceReliabilities),
    golden_branch:       pickByReliability(rec1, rec2, 'branch', sourceReliabilities),
    golden_course:       pickByReliability(rec1, rec2, 'course', sourceReliabilities),
    golden_dob:          pickByReliability(rec1, rec2, 'dob', sourceReliabilities),
    confidence_score:    confidenceScore
  };
}

// ---------------------------------------------------------------------------
// Main pipeline entry point
// ---------------------------------------------------------------------------
export const evaluateAndBlockCandidates = async (newRecords = []) => {
  if (!newRecords || newRecords.length === 0) {
    return { conflicts_generated: 0, auto_merged: 0, unique_promoted: 0, ml_status: 'skipped' };
  }

  let conflictsGenerated = 0;
  let autoMergedCount = 0;
  let uniquePromotedCount = 0;

  // -----------------------------------------------------------------------
  // 0. Fetch source reliability scores for weighted field selection
  // -----------------------------------------------------------------------
  const { data: allSources } = await supabase.from('sources').select('id, reliability_score');
  const sourceReliabilities = new Map();
  if (allSources) {
    for (const src of allSources) {
      sourceReliabilities.set(src.id, parseFloat(src.reliability_score));
    }
  }

  // -----------------------------------------------------------------------
  // 1. Fetch existing records and build comparison pairs
  // -----------------------------------------------------------------------
  const newIds = new Set(newRecords.map((r) => r.id));
  const { data: existingRecords, error } = await supabase.from('raw_students').select('*');
  if (error || !existingRecords) {
    return { conflicts_generated: 0, auto_merged: 0, unique_promoted: 0, ml_status: 'db_error' };
  }

  const candidatePool = existingRecords.filter((r) => !newIds.has(r.id));
  const pairsToScore = [];

  // Compare new records against existing records
  for (const newRec of newRecords) {
    for (const candRec of candidatePool) {
      pairsToScore.push({
        newRec,
        candRec,
        payload: {
          record1: toMLRecord(newRec),
          record2: toMLRecord(candRec)
        }
      });
    }
  }

  // Compare new records against EACH OTHER (intra-file duplicates)
  for (let i = 0; i < newRecords.length; i++) {
    for (let j = i + 1; j < newRecords.length; j++) {
      pairsToScore.push({
        newRec: newRecords[i],
        candRec: newRecords[j],
        payload: {
          record1: toMLRecord(newRecords[i]),
          record2: toMLRecord(newRecords[j])
        }
      });
    }
  }

  // Track records that got matched or conflicted (score >= THRESHOLD_REVIEW)
  const hasMatchOrConflict = new Set();

  if (pairsToScore.length > 0) {
    // -------------------------------------------------------------------
    // 2. Call ML Python script
    // -------------------------------------------------------------------
    const mlInput = pairsToScore.map(p => p.payload);

    const possiblePaths = [
      path.resolve(__dirname, '../../../ml/src/predict_batch.py'),
      path.resolve(__dirname, '../../ml/src/predict_batch.py'),
      path.resolve(process.cwd(), 'ml/src/predict_batch.py'),
      path.resolve(process.cwd(), '../ml/src/predict_batch.py')
    ];
    const mlScriptPath = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];

    const pythonBins = [
      process.env.PYTHON_BIN,
      process.platform === 'win32' ? 'python' : 'python3',
      process.platform === 'win32' ? 'python3' : 'python'
    ].filter(Boolean);

    let result = null;
    let usedPythonBin = null;
    for (const pyBin of pythonBins) {
      try {
        result = spawnSync(pyBin, [mlScriptPath], {
          input: JSON.stringify(mlInput),
          encoding: 'utf8',
          maxBuffer: 50 * 1024 * 1024,
          timeout: 120000  // 2 minute timeout
        });
        if (result && !result.error) {
          usedPythonBin = pyBin;
          break;
        }
      } catch {
        // try next binary candidate
      }
    }

    // -------------------------------------------------------------------
    // 3. CRITICAL: Handle ML failure properly — DO NOT silently continue
    // -------------------------------------------------------------------
    if (!result || result.error) {
      console.error('[PIPELINE CRITICAL] ML Python execution FAILED entirely:', {
        error: result?.error?.message || 'No compatible python executable found',
        scriptPath: mlScriptPath,
        scriptExists: fs.existsSync(mlScriptPath),
        triedBins: pythonBins
      });

      // Instead of silently promoting all as unique, return an error
      // so the caller knows ML didn't run
      return {
        conflicts_generated: 0,
        auto_merged: 0,
        unique_promoted: 0,
        ml_status: 'FAILED',
        ml_error: `ML engine failed: ${result?.error?.message || 'Python not found'}. Script path: ${mlScriptPath} (exists: ${fs.existsSync(mlScriptPath)})`
      };
    }

    if (result.stderr) {
      // ML warnings (like sklearn feature name warnings) go to stderr
      console.warn('[ML stderr]', result.stderr.substring(0, 500));
    }

    let predictions = [];
    try {
      predictions = JSON.parse(result.stdout);
    } catch (e) {
      console.error('[PIPELINE CRITICAL] Failed to parse ML output:', {
        stdout: result.stdout?.substring(0, 500),
        stderr: result.stderr?.substring(0, 500),
        pythonBin: usedPythonBin,
        exitCode: result.status
      });

      return {
        conflicts_generated: 0,
        auto_merged: 0,
        unique_promoted: 0,
        ml_status: 'PARSE_ERROR',
        ml_error: `ML returned unparseable output. Exit code: ${result.status}. stderr: ${result.stderr?.substring(0, 200)}`
      };
    }

    if (!predictions || !Array.isArray(predictions) || predictions.length !== pairsToScore.length) {
      console.error('[PIPELINE CRITICAL] ML prediction count mismatch:', {
        expected: pairsToScore.length,
        received: Array.isArray(predictions) ? predictions.length : 'not-array'
      });

      return {
        conflicts_generated: 0,
        auto_merged: 0,
        unique_promoted: 0,
        ml_status: 'MISMATCH',
        ml_error: `Expected ${pairsToScore.length} predictions, got ${Array.isArray(predictions) ? predictions.length : 'non-array'}`
      };
    }

    // -------------------------------------------------------------------
    // 4. Triage predictions using architecture-aligned thresholds
    // -------------------------------------------------------------------
    const { data: allLinks } = await supabase.from('student_entity_links').select('raw_student_id, master_student_id');
    const masterLinks = new Map();
    if (allLinks) {
      for (const link of allLinks) {
        masterLinks.set(link.raw_student_id, link.master_student_id);
      }
    }

    console.log(`[PIPELINE] Processing ${pairsToScore.length} pairs with ML scores...`);

    for (let i = 0; i < pairsToScore.length; i++) {
      const pair = pairsToScore[i];
      const confidenceScore = predictions[i];
      const newRec = pair.newRec;
      const candRec = pair.candRec;

      if (confidenceScore >= THRESHOLD_REVIEW) {
        hasMatchOrConflict.add(newRec.id);
        if (newIds.has(candRec.id)) hasMatchOrConflict.add(candRec.id);
      }

      // -----------------------------------------------------------------
      // TIER 1: High Confidence (>= 0.90) — Auto-merge OR review if reg_no conflicts
      // -----------------------------------------------------------------
      if (confidenceScore >= THRESHOLD_AUTO_MERGE) {
        const regConflict = newRec.reg_no && candRec.reg_no && newRec.reg_no !== candRec.reg_no;

        if (regConflict) {
          // reg_no mismatch despite high ML score → force to human review
          const fieldDiffs = {
            name:         { record_1: newRec.name,         record_2: candRec.name },
            email:        { record_1: newRec.email,        record_2: candRec.email },
            phone_number: { record_1: newRec.phone_number, record_2: candRec.phone_number },
            reg_no:       { record_1: newRec.reg_no,       record_2: candRec.reg_no },
            branch:       { record_1: newRec.branch,       record_2: candRec.branch },
            dob:          { record_1: newRec.dob,          record_2: candRec.dob }
          };

          const { error: cqErr } = await supabase.from('student_conflict_queue').insert([{
            record_1_id: newRec.id,
            record_2_id: candRec.id,
            match_confidence: confidenceScore,
            field_diffs: fieldDiffs,
            status: 'PENDING'
          }]);
          if (!cqErr) conflictsGenerated++;
          console.log(`[PIPELINE] REG_NO CONFLICT: ${newRec.reg_no} vs ${candRec.reg_no} (score: ${confidenceScore.toFixed(3)}) → REVIEW`);
        } else {
          // Safe to auto-merge
          const existingMasterId = masterLinks.get(newRec.id) || masterLinks.get(candRec.id);
          let masterId = existingMasterId;
          const goldenPayload = buildGoldenPayload(newRec, candRec, confidenceScore, sourceReliabilities);

          if (masterId) {
            await supabase.from('master_students').update({ confidence_score: confidenceScore }).eq('id', masterId);
          } else {
            const { data: master } = await supabase.from('master_students').insert([goldenPayload]).select().single();
            if (master) masterId = master.id;
          }

          if (masterId) {
            autoMergedCount++;
            masterLinks.set(newRec.id, masterId);
            masterLinks.set(candRec.id, masterId);

            await supabase.from('student_entity_links').upsert([
              { raw_student_id: newRec.id, master_student_id: masterId, match_score: confidenceScore, link_type: 'AUTO_MATCH' },
              { raw_student_id: candRec.id, master_student_id: masterId, match_score: confidenceScore, link_type: 'AUTO_MATCH' }
            ], { onConflict: 'raw_student_id, master_student_id' });

            await generateHashEntry({
              masterStudentId: masterId,
              actionType: 'AUTO_RESOLVE',
              changedBy: 'ML_Engine',
              changeSummary: { confidence_score: confidenceScore, golden_payload: goldenPayload }
            });

            console.log(`[PIPELINE] AUTO-MERGE: ${newRec.name} + ${candRec.name} (score: ${confidenceScore.toFixed(3)}) → master ${masterId}`);
          }
        }

      // -----------------------------------------------------------------
      // TIER 2: Ambiguous (0.60–0.89) — Send to human review queue
      // -----------------------------------------------------------------
      } else if (confidenceScore >= THRESHOLD_REVIEW && confidenceScore < THRESHOLD_AUTO_MERGE) {
        const fieldDiffs = {
          name:         { record_1: newRec.name,         record_2: candRec.name },
          email:        { record_1: newRec.email,        record_2: candRec.email },
          phone_number: { record_1: newRec.phone_number, record_2: candRec.phone_number },
          reg_no:       { record_1: newRec.reg_no,       record_2: candRec.reg_no },
          branch:       { record_1: newRec.branch,       record_2: candRec.branch },
          dob:          { record_1: newRec.dob,          record_2: candRec.dob }
        };

        // Avoid duplicate conflict entries
        const { data: existingConflict } = await supabase
          .from('student_conflict_queue')
          .select('id')
          .or(`and(record_1_id.eq.${newRec.id},record_2_id.eq.${candRec.id}),and(record_1_id.eq.${candRec.id},record_2_id.eq.${newRec.id})`)
          .single();

        if (!existingConflict) {
          const { error: queueErr } = await supabase.from('student_conflict_queue').insert([{
            record_1_id: newRec.id,
            record_2_id: candRec.id,
            match_confidence: confidenceScore,
            field_diffs: fieldDiffs,
            status: 'PENDING'
          }]);
          if (!queueErr) conflictsGenerated++;
          console.log(`[PIPELINE] REVIEW: ${newRec.name} vs ${candRec.name} (score: ${confidenceScore.toFixed(3)}) → conflict queue`);
        }
      }
      // TIER 3: Low Confidence (< 0.60) — records stay distinct (handled below)
    }
  }

  // -----------------------------------------------------------------------
  // 5. Handle unique records — those with no match >= THRESHOLD_REVIEW
  // -----------------------------------------------------------------------
  for (const newRec of newRecords) {
    if (!hasMatchOrConflict.has(newRec.id)) {
      const goldenPayload = {
        golden_reg_no:       newRec.reg_no,
        golden_name:         newRec.name,
        golden_email:        newRec.email,
        golden_phone_number: newRec.phone_number,
        golden_branch:       newRec.branch,
        golden_course:       newRec.course,
        golden_dob:          newRec.dob,
        confidence_score:    1.0 // Unique, self-confidence is 100%
      };

      const { data: master } = await supabase.from('master_students').insert([goldenPayload]).select().single();
      if (master) {
        uniquePromotedCount++;
        await supabase.from('student_entity_links').insert([
          { raw_student_id: newRec.id, master_student_id: master.id, match_score: 1.0, link_type: 'INITIAL_INGESTION' }
        ]);

        await generateHashEntry({
          masterStudentId: master.id,
          actionType: 'NEW_UNIQUE_ENTITY',
          changedBy: 'Ingestion_Pipeline',
          changeSummary: { confidence_score: 1.0, golden_payload: goldenPayload }
        });

        console.log(`[PIPELINE] UNIQUE: ${newRec.name} → new master ${master.id}`);
      }
    }
  }

  return {
    conflicts_generated: conflictsGenerated,
    auto_merged: autoMergedCount,
    unique_promoted: uniquePromotedCount,
    ml_status: 'OK'
  };
};
