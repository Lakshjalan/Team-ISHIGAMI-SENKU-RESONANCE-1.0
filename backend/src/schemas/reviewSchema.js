import { z } from 'zod';

export const resolveConflictSchema = z.object({
  body: z.object({
    conflict_id: z.string().uuid('Invalid conflict_id UUID format'),
    decision: z.enum(['APPROVED', 'REJECTED', 'EDITED'], {
      errorMap: () => ({ message: 'Decision must be APPROVED, REJECTED, or EDITED' })
    }),
    resolved_by: z.string().optional().default('human_reviewer'),
    golden_override: z
      .object({
        golden_reg_no: z.string().optional(),
        golden_name: z.string().optional(),
        golden_email: z.string().optional(),
        golden_phone_number: z.string().optional(),
        golden_branch: z.string().optional(),
        golden_course: z.string().optional(),
        golden_dob: z.string().optional(),
        confidence_score: z.number().optional()
      })
      .optional()
  })
});
