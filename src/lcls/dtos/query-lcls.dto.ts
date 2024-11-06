import { z } from 'zod';

export const QueryLclSchema = z.object({
  cost: z.number().min(0).optional(),
  freight_id: z.string().min(0).optional(),
});

export type QueryLclDto = z.infer<typeof QueryLclSchema>;