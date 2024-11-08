import { z } from 'zod';

export const QueryAirFreightSchema = z.object({
  price_0K: z.number().min(0).optional(),
  price_45K: z.number().min(0).optional(),
  price_100K: z.number().min(0).optional(),
  price_300K: z.number().min(0).optional(),
  price_500K: z.number().min(0).optional(),
  freight_id: z.string().min(0).optional(),
});

export type QueryAirFreightDto = z.infer<typeof QueryAirFreightSchema>;