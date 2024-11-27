import { z } from 'zod';

export const QueryFclSchema = z.object({
  price_20dc: z.coerce.number().min(0).optional(),
  price_40dc: z.coerce.number().min(0).optional(),
  price_40hc: z.coerce.number().min(0).optional(),
  price_20rf: z.coerce.number().min(0).optional(),
  price_40rf: z.coerce.number().min(0).optional(),
  freight_id: z.string().min(0).uuid().optional(),
  fcl_id: z.string().min(0).uuid().optional(),
});

export type QueryFclDto = z.infer<typeof QueryFclSchema>;