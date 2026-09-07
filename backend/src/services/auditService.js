import crypto from 'crypto';
import { supabase } from '../config/supabase.js';

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

export const generateHashEntry = async ({ masterStudentId, actionType, changedBy, changeSummary }) => {
  const { data: lastLedger } = await supabase
    .from('student_audit_ledger')
    .select('current_hash')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const previousHash = lastLedger?.current_hash || GENESIS_HASH;
  const timestamp = new Date().toISOString();
  const payloadString = `${previousHash}|${masterStudentId}|${actionType}|${timestamp}`;
  const currentHash = crypto.createHash('sha256').update(payloadString).digest('hex');

  const { data: newEntry, error } = await supabase
    .from('student_audit_ledger')
    .insert([
      {
        master_student_id: masterStudentId,
        action_type: actionType,
        previous_hash: previousHash,
        current_hash: currentHash,
        performed_by: changedBy,
        payload: changeSummary
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return newEntry;
};

export const verifyHashLedgerChain = async () => {
  const { data: ledger, error } = await supabase
    .from('student_audit_ledger')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;

  let isValid = true;
  const verificationLog = [];

  for (let i = 0; i < ledger.length; i++) {
    const entry = ledger[i];
    const expectedPreviousHash = i === 0 ? GENESIS_HASH : ledger[i - 1].current_hash;

    if (entry.previous_hash !== expectedPreviousHash) {
      isValid = false;
      verificationLog.push({ id: entry.id, status: 'TAMPERED_PREVIOUS_HASH_MISMATCH', entry });
    } else {
      verificationLog.push({ id: entry.id, status: 'VALID' });
    }
  }

  return {
    tamper_free: isValid,
    total_ledger_records: ledger.length,
    verification: verificationLog
  };
};
