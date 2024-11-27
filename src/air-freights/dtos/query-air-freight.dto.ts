import { z } from 'zod';

export const QueryAirFreightSchema = z.object({
  price_0K: z.coerce.number().min(0).optional(),
  price_45K: z.coerce.number().min(0).optional(),
  price_100K: z.coerce.number().min(0).optional(),
  price_300K: z.coerce.number().min(0).optional(),
  price_500K: z.coerce.number().min(0).optional(),
  freight_id: z.string().min(0).uuid().optional(),
  air_freight_id: z.string().min(0).uuid().optional(),
});

export type QueryAirFreightDto = z.infer<typeof QueryAirFreightSchema>;