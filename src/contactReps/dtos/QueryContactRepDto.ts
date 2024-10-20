import { z } from 'zod';

export const QueryContactRepSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export type QueryContactRepDto = z.infer<typeof QueryContactRepSchema>;
