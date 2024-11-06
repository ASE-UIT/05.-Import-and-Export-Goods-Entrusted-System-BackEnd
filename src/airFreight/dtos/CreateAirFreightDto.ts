import { z } from 'zod';

export const CreateAirFreightSchema = z.object({
  price_0K: z.number().min(0),
  price_45K: z.number().min(0),
  price_100K: z.number().min(0),
  price_300K: z.number().min(0),
  price_500K: z.number().min(0),
  freight_id: z.string().min(0)
});

export type CreateAirFreightDto = z.infer<typeof CreateAirFreightSchema>;
