import { supabase } from '../config/supabase.js';
import { cacheService } from '../config/redis.js';
import { generateHashEntry } from '../services/auditService.js';
import { autoAssignConflicts } from '../services/assignmentService.js';

export const getReviewQueue = async (req, res, next) => {
  const cacheKey = 'api:review:queue';
  const cached = await cacheService.get(cacheKey);
  if (cached) return res.json({ queue: cached, cache: 'HIT' });

  try {
    const { data, error } = await supabase
      .from('student_conflict_queue')
      .select(`
        *,
        record_1:record_1_id(*),
        record_2:record_2_id(*)
      `)
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false });

    if (error) throw error;

    await cacheService.set(cacheKey, data, 60);
    res.json({ queue: data, cache: 'MISS' });
  } catch (err) {
    next(err);
  }
};

export const resolveConflict = async (req, res, next) => {
  const { conflict_id, decision, resolved_by = 'human_reviewer', golden_override } = req.body;

  try {
    const { data: conflict, error: fetchErr } = await supabase
      .from('student_conflict_queue')
      .select('*, record_1:record_1_id(*), record_2:record_2_id(*)')
      .eq('id', conflict_id)
      .single();

    if (fetchErr || !conflict) {
      return res.status(404).json({ error: 'Conflict record not found' });
    }

    let masterStudentId = null;

    if (decision === 'APPROVED' || decision === 'EDITED') {
      const rec1 = conflict.record_1;
      const rec2 = conflict.record_2;

      const goldenPayload = golden_override || {
        golden_reg_no: rec1.reg_no || rec2.reg_no,
        golden_name: rec1.name || rec2.name,
        golden_email: rec1.email || rec2.email,
        golden_phone_number: rec1.phone_number || rec2.phone_number,
        golden_branch: rec1.branch || rec2.branch,
        golden_course: rec1.course || rec2.course,
        golden_dob: rec1.dob || rec2.dob,
        confidence_score: conflict.match_confidence
      };

      const { data: master, error: masterErr } = await supabase
        .from('master_students')
        .insert([goldenPayload])
        .select()
        .single();

      if (masterErr) throw masterErr;
      masterStudentId = master.id;

      // Link raw records
      await supabase.from('student_entity_links').insert([
        { raw_student_id: rec1.id, master_student_id: master.id, match_score: conflict.match_confidence, link_type: 'MANUAL_APPROVAL' },
        { raw_student_id: rec2.id, master_student_id: master.id, match_score: conflict.match_confidence, link_type: 'MANUAL_APPROVAL' }
      ]);

      // Cryptographic SHA-256 Audit Ledger Entry
      await generateHashEntry({
        masterStudentId: master.id,
        actionType: decision === 'APPROVED' ? 'MERGE_APPROVED' : 'MANUAL_OVERRIDE',
        changedBy: resolved_by,
        changeSummary: { decision, conflict_id, golden_payload: goldenPayload }
      });

      await cacheService.del(`api:entities:audit:${master.id}`);
    }

    // Update conflict status
    await supabase
      .from('student_conflict_queue')
      .update({ status: decision, resolved_by, resolved_at: new Date().toISOString() })
      .eq('id', conflict_id);

    // Invalidate Redis caches
    await cacheService.del('api:review:queue');
    await cacheService.del('api:entities:master');

    res.json({ message: `Conflict resolution recorded as ${decision}`, master_student_id: masterStudentId });
  } catch (err) {
    next(err);
  }
};

export const distributeConflicts = async (req, res, next) => {
  try {
    const result = await autoAssignConflicts();
    await cacheService.del('api:review:queue');
    res.json({ message: 'Conflicts distributed successfully', ...result });
  } catch (err) {
    next(err);
  }
};

