import { evaluateAndBlockCandidates } from './src/services/blockingService.js';
import { supabase } from './src/config/supabase.js';

async function run() {
  const { data: inserted } = await supabase.from('raw_students').select('*');
  const res = await evaluateAndBlockCandidates(inserted);
  console.log('Result:', res);
}
run();
