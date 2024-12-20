import { z } from 'zod';

export const QueryContactRepSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  id: z.string().min(1).uuid().optional(),
  provider_id: z.string().uuid().optional(), 
  branch_location: z.string().optional(),
});

export type QueryContactRepDto = z.infer<typeof QueryContactRepSchema>;
