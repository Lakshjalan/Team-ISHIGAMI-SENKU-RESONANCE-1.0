import { evaluateAndBlockCandidates } from './src/services/blockingService.js';
import Papa from 'papaparse';
import fs from 'fs';
import { normalizeRecord } from './src/services/normalizationServices.js';

const allRows = [];

for (const f of ['dataset1_erp.csv', 'dataset2_library.csv', 'dataset3_hostel.csv']) {
  const txt = fs.readFileSync('../ml/data/' + f, 'utf8');
  const parsed = Papa.parse(txt, { header: true, skipEmptyLines: true }).data;
  
  for (const r of parsed) {
    allRows.push({
      id: Math.random().toString(), // fake id
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
}

const pairsToScore = [];
for (let i = 0; i < allRows.length; i++) {
  for (let j = i + 1; j < allRows.length; j++) {
    pairsToScore.push({ record1: allRows[i], record2: allRows[j] });
  }
}

fs.writeFileSync('test_pairs.json', JSON.stringify(pairsToScore));
