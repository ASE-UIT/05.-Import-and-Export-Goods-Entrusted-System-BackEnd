import { z } from 'zod';

export const QueryLegalRepsSchema = z.object({
  email: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
});

export type QueryLegalRepsDto = z.infer<typeof QueryLegalRepsSchema>;
