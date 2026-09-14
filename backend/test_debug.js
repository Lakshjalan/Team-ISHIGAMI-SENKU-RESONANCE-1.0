import { evaluateAndBlockCandidates } from './src/services/blockingService.js';
import Papa from 'papaparse';
import fs from 'fs';
import { normalizeRecord } from './src/services/normalizationServices.js';
import { supabase } from './src/config/supabase.js';

async function run() {
  await supabase.from('student_entity_links').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('master_students').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('raw_students').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  const allRows = [];
  const txt = fs.readFileSync('../ml/data/dataset1_erp.csv', 'utf8');
  const parsed = Papa.parse(txt, { header: true, skipEmptyLines: true }).data;
  for (const r of parsed) {
    allRows.push({
      source_id: 'cf78028d-933c-4f01-9b87-be591ea479b1',
      reg_no: r.reg_no || null,
      name: r.name || 'UNKNOWN',
      email: r.email || null,
      phone_number: r.phone_number || r.phone || null,
      branch: r.branch || null,
      course: r.course || null,
      dob: r.dob || null,
      raw_payload: r,
      normalized_payload: normalizeRecord(r)
    });
  }
  
  const { data: inserted } = await supabase.from('raw_students').insert(allRows).select();
  const res = await evaluateAndBlockCandidates(inserted);
  console.log('Result:', res);
}
run();
