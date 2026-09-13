import { supabase } from '../config/supabase.js';
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateHashEntry } from './auditService.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const evaluateAndBlockCandidates = async (newRecords = []) => {
  if (!newRecords || newRecords.length === 0) return { conflicts_generated: 0, auto_merged: 0 };

  let conflictsGenerated = 0;
  let autoMergedCount = 0;
  let uniquePromotedCount = 0;

  // Fetch all existing raw records to compare against
  const newIds = new Set(newRecords.map((r) => r.id));
  const { data: existingRecords, error } = await supabase.from('raw_students').select('*');
  if (error || !existingRecords) return { conflicts_generated: 0, auto_merged: 0 };

  const candidatePool = existingRecords.filter((r) => !newIds.has(r.id));
  const pairsToScore = [];
  
  // 1. Compare new records against existing records
  for (const newRec of newRecords) {
    for (const candRec of candidatePool) {
      pairsToScore.push({
        newRec,
        candRec,
        payload: {
          record1: newRec.normalized_payload || newRec,
          record2: candRec.normalized_payload || candRec
        }
      });
    }
  }
  
  // 2. Compare new records against EACH OTHER (intra-file duplicates)
  for (let i = 0; i < newRecords.length; i++) {
    for (let j = i + 1; j < newRecords.length; j++) {
      const newRec1 = newRecords[i];
      const newRec2 = newRecords[j];
      pairsToScore.push({
        newRec: newRec1,
        candRec: newRec2,
        payload: {
          record1: newRec1.normalized_payload || newRec1,
          record2: newRec2.normalized_payload || newRec2
        }
      });
    }
  }
  
  // Track records that got matched or conflicted (score >= 0.60)
  const hasMatchOrConflict = new Set();
  
  if (pairsToScore.length > 0) {
    // Call ML Python script
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
    for (const pyBin of pythonBins) {
      try {
        result = spawnSync(pyBin, [mlScriptPath], {
          input: JSON.stringify(mlInput),
          encoding: 'utf8',
          maxBuffer: 50 * 1024 * 1024
        });
        if (result && !result.error) break;
      } catch {
        // try next binary candidate
      }
    }

    if (!result || result.error) {
      console.error('ML Python execution failed:', result?.error || 'No compatible python executable found');
    } else {
      if (result.stderr) {
        console.error('ML Python stderr:', result.stderr);
      }

      let predictions = [];
      try {
        predictions = JSON.parse(result.stdout);
      } catch (e) {
        console.error('Failed to parse ML output:', result.stdout);
      }

      if (predictions && predictions.length === pairsToScore.length) {
        for (let i = 0; i < pairsToScore.length; i++) {
          const pair = pairsToScore[i];
          const confidenceScore = predictions[i];
          const newRec = pair.newRec;
          const candRec = pair.candRec;
          
          if (confidenceScore >= 0.60) {
            hasMatchOrConflict.add(newRec.id);
            if (newIds.has(candRec.id)) hasMatchOrConflict.add(candRec.id);
          }
          
          // Triage Classification
          if (confidenceScore >= 0.85) {
            const goldenPayload = {
              golden_reg_no: newRec.reg_no || candRec.reg_no,
              golden_name: newRec.name || candRec.name,
              golden_email: newRec.email || candRec.email,
              golden_phone_number: newRec.phone_number || candRec.phone_number,
              golden_branch: newRec.branch || candRec.branch,
              golden_course: newRec.course || candRec.course,
              golden_dob: newRec.dob || candRec.dob,
              confidence_score: confidenceScore
            };

            const { data: master } = await supabase.from('master_students').insert([goldenPayload]).select().single();
            if (master) {
              autoMergedCount++;
              await supabase.from('student_entity_links').insert([
                { raw_student_id: newRec.id, master_student_id: master.id, match_score: confidenceScore, link_type: 'AUTO_MATCH' },
                { raw_student_id: candRec.id, master_student_id: master.id, match_score: confidenceScore, link_type: 'AUTO_MATCH' }
              ]);
              
              await generateHashEntry({
                masterStudentId: master.id,
                actionType: 'AUTO_RESOLVE',
                changedBy: 'ML_Engine',
                changeSummary: { confidence_score: confidenceScore, golden_payload: goldenPayload }
              });
            }
          } else if (confidenceScore >= 0.60 && confidenceScore < 0.85) {
            const fieldDiffs = {
              name: { record_1: newRec.name, record_2: candRec.name },
              email: { record_1: newRec.email, record_2: candRec.email },
              phone_number: { record_1: newRec.phone_number, record_2: candRec.phone_number },
              reg_no: { record_1: newRec.reg_no, record_2: candRec.reg_no }
            };

            const { data: existingConflict } = await supabase
              .from('student_conflict_queue')
              .select('id')
              .or(`and(record_1_id.eq.${newRec.id},record_2_id.eq.${candRec.id}),and(record_1_id.eq.${candRec.id},record_2_id.eq.${newRec.id})`)
              .single();

            if (!existingConflict) {
              const { error: queueErr } = await supabase.from('student_conflict_queue').insert([
                {
                  record_1_id: newRec.id,
                  record_2_id: candRec.id,
                  match_confidence: confidenceScore,
                  field_diffs: fieldDiffs,
                  status: 'PENDING'
                }
              ]);
              if (!queueErr) conflictsGenerated++;
            }
          }
        }
      }
    }
  }

  // Handle unique records (no matches >= 0.60, or pairsToScore was empty)
  for (const newRec of newRecords) {
    if (!hasMatchOrConflict.has(newRec.id)) {
      const goldenPayload = {
        golden_reg_no: newRec.reg_no,
        golden_name: newRec.name,
        golden_email: newRec.email,
        golden_phone_number: newRec.phone_number,
        golden_branch: newRec.branch,
        golden_course: newRec.course,
        golden_dob: newRec.dob,
        confidence_score: 1.0 // Unique, self-confidence is 100%
      };
      
      const { data: master } = await supabase.from('master_students').insert([goldenPayload]).select().single();
      if (master) {
        uniquePromotedCount++;
        await supabase.from('student_entity_links').insert([
          { raw_student_id: newRec.id, master_student_id: master.id, match_score: 1.0, link_type: 'UNIQUE_CREATION' }
        ]);
        
        await generateHashEntry({
          masterStudentId: master.id,
          actionType: 'NEW_UNIQUE_ENTITY',
          changedBy: 'Ingestion_Pipeline',
          changeSummary: { confidence_score: 1.0, golden_payload: goldenPayload }
        });
      }
    }
  }

  return { conflicts_generated: conflictsGenerated, auto_merged: autoMergedCount, unique_promoted: uniquePromotedCount };
};
