import { z } from 'zod';

export const QueryAirFreightSchema = z.object({
  price_45K: z.number().optional(),
  price_100K: z.number().optional(),
  price_300K: z.number().optional(),
  price_500K: z.number().optional(),
  FSC: z.number().optional(),
  AMS_Fees: z.number().optional(),
  SCC: z.string().optional(),
  routine: z.string().optional(),
});

export type QueryAirFreightDto = z.infer<typeof QueryAirFreightSchema>;
