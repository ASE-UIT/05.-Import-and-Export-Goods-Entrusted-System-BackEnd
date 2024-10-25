import { z } from 'zod';

export const CreateSeaFreightSchema = z.object({
  price_20dc: z.number().min(0),
  price_40dc: z.number().min(0),
  price_40hc: z.number().min(0),
  price_20rf: z.number().min(0),
  price_40rf: z.number().min(0),
  freight_id: z.string().min(0)
});

export type CreateSeaFreightDto = z.infer<typeof CreateSeaFreightSchema>;
