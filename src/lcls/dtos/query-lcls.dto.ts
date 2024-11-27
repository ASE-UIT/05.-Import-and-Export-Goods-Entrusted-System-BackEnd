import { z } from 'zod';

export const QueryLclSchema = z.object({
  cost: z.coerce.number().min(0).optional(),
  freight_id: z.string().min(0).uuid().optional(),
  lcl_id: z.string().min(0).uuid().optional(),
});

export type QueryLclDto = z.infer<typeof QueryLclSchema>;