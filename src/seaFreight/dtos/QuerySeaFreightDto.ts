import { z } from 'zod';

export const QuerySeaFreightSchema = z.object({
  price_20dc: z.number().optional(),
  price_40dc: z.number().optional(),
  price_40hc: z.number().optional(),
  price_20rf: z.number().optional(),
  price_40rf: z.number().optional(),
});

export type QuerySeaFreightDto = z.infer<typeof QuerySeaFreightSchema>;
