import { z } from 'zod';

export const uploadSchema = z.object({
  body: z.object({
    source_name: z.string().min(1, 'Source name is required'),
    reliability_score: z.number().min(0).max(1).optional().default(0.85),
    records: z
      .array(
        z.object({
          name: z.string().min(1, 'Record name is required'),
          reg_no: z.string().optional().nullable(),
          email: z.string().optional().nullable(),
          phone: z.string().optional().nullable(),
          phone_number: z.string().optional().nullable(),
          branch: z.string().optional().nullable(),
          course: z.string().optional().nullable(),
          dob: z.string().optional().nullable()
        }).passthrough()
      )
      .min(1, 'Records array must contain at least 1 record')
  })
});
