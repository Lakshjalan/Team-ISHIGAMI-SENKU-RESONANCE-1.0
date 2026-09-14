import fs from 'fs';

let content = fs.readFileSync('src/services/blockingService.js', 'utf8');

// Restore original regConflict logic
const oldTriage =           // Triage Classification
          if (confidenceScore >= 0.90) {
            const existingMasterId = masterLinks.get(newRec.id) || masterLinks.get(candRec.id);
            let masterId = existingMasterId;

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
            }
          };

const newTriage =           // Triage Classification
          if (confidenceScore >= 0.90) {
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
            } else {
              const existingMasterId = masterLinks.get(newRec.id) || masterLinks.get(candRec.id);
              let masterId = existingMasterId;

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
              }
            }
          };
          
content = content.replace(oldTriage, newTriage);

// Fix UNIQUE_CREATION link_type to INITIAL_INGESTION
content = content.replace("link_type: 'UNIQUE_CREATION'", "link_type: 'INITIAL_INGESTION'");

fs.writeFileSync('src/services/blockingService.js', content);
