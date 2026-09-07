import { supabase } from '../config/supabase.js';

// Calculate Trigram Similarity (Levenshtein / Token Jaccard fallback)
const computeStringSimilarity = (str1 = '', str2 = '') => {
  const s1 = (str1 || '').toLowerCase().trim();
  const s2 = (str2 || '').toLowerCase().trim();
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1.0;

  // Trigram Jaccard Index
  const getTrigrams = (str) => {
    const padded = `  ${str} `;
    const trigrams = new Set();
    for (let i = 0; i < padded.length - 2; i++) {
      trigrams.add(padded.slice(i, i + 3));
    }
    return trigrams;
  };

  const t1 = getTrigrams(s1);
  const t2 = getTrigrams(s2);
  let intersection = 0;

  for (const tri of t1) {
    if (t2.has(tri)) intersection++;
  }

  const union = t1.size + t2.size - intersection;
  return union > 0 ? Number((intersection / union).toFixed(2)) : 0;
};

export const evaluateAndBlockCandidates = async (newRecords = []) => {
  if (!newRecords || newRecords.length === 0) return { conflicts_generated: 0, auto_merged: 0 };

  let conflictsGenerated = 0;
  let autoMergedCount = 0;

  // Fetch all existing raw records to compare against
  const newIds = new Set(newRecords.map((r) => r.id));
  const { data: existingRecords, error } = await supabase.from('raw_students').select('*');
  if (error || !existingRecords) return { conflicts_generated: 0, auto_merged: 0 };

  const candidatePool = existingRecords.filter((r) => !newIds.has(r.id));

  for (const newRec of newRecords) {
    for (const candRec of candidatePool) {
      // Don't compare records from the same source
      if (newRec.source_id === candRec.source_id) continue;

      const norm1 = newRec.normalized_payload || {};
      const norm2 = candRec.normalized_payload || {};

      // 1. Calculate similarity metrics
      const nameSim = computeStringSimilarity(norm1.name || newRec.name, norm2.name || candRec.name);
      const emailMatch = norm1.email && norm2.email && norm1.email === norm2.email ? 1.0 : 0;
      const phoneMatch = norm1.phone_number && norm2.phone_number && norm1.phone_number === norm2.phone_number ? 1.0 : 0;
      const regNoMatch = norm1.normalized_reg_no && norm2.normalized_reg_no && norm1.normalized_reg_no === norm2.normalized_reg_no ? 1.0 : 0;

      // 2. Compute Match Confidence Score C_match
      let score = nameSim * 0.45;
      if (emailMatch) score += 0.35;
      if (phoneMatch) score += 0.30;
      if (regNoMatch) score += 0.40;

      const confidenceScore = Math.min(1.0, Number(score.toFixed(2)));

      // 3. Triage Classification
      if (confidenceScore >= 0.90) {
        // High confidence -> Auto-Merge
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
        }
      } else if (confidenceScore >= 0.60 && confidenceScore < 0.90) {
        // Ambiguous match -> Add to student_conflict_queue for human review
        const fieldDiffs = {
          name: { record_1: newRec.name, record_2: candRec.name },
          email: { record_1: newRec.email, record_2: candRec.email },
          phone_number: { record_1: newRec.phone_number, record_2: candRec.phone_number },
          reg_no: { record_1: newRec.reg_no, record_2: candRec.reg_no }
        };

        // Check if pair already exists in conflict queue
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

  return { conflicts_generated: conflictsGenerated, auto_merged: autoMergedCount };
};
