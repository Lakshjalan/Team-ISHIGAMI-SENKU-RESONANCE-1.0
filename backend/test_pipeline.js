import { evaluateAndBlockCandidates } from './src/services/blockingService.js';
import { supabase } from './src/config/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const { data: inserted } = await supabase.from('raw_students').select('*');
  console.log('Total raw records:', inserted ? inserted.length : 0);
  const res = await evaluateAndBlockCandidates(inserted);
  console.log('Result:', res);
}
run();
