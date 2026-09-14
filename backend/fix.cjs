const fs = require('fs');
let content = fs.readFileSync('src/services/blockingService.js', 'utf8');

// replace UNIQUE_CREATION
content = content.replace('UNIQUE_CREATION', 'INITIAL_INGESTION');

// Insert regConflict logic
const oldLine = 'if (confidenceScore >= 0.90) {';
const regConflictBlock = `if (confidenceScore >= 0.90) {
            const regConflict = newRec.reg_no && candRec.reg_no && newRec.reg_no !== candRec.reg_no;
            if (regConflict) {
              const fieldDiffs = {
                name: { record_1: newRec.name, record_2: candRec.name },
                email: { record_1: newRec.email, record_2: candRec.email },
                phone_number: { record_1: newRec.phone_number, record_2: candRec.phone_number },
                reg_no: { record_1: newRec.reg_no, record_2: candRec.reg_no }
              };
              const { error: cqErr } = await supabase.from('student_conflict_queue').insert([
                { record_1_id: newRec.id, record_2_id: candRec.id, match_confidence: confidenceScore, field_diffs: fieldDiffs, status: 'PENDING' }
              ]);
              if (!cqErr) conflictsGenerated++;
            } else {`;

content = content.replace(oldLine, regConflictBlock);

// Find the end of the if (confidenceScore >= 0.90) block to add closing brace
const searchStr = '              });\n            }';
const replaceStr = '              });\n            }\n            }';
content = content.replace(searchStr, replaceStr);

fs.writeFileSync('src/services/blockingService.js', content);
