import { z } from 'zod';

export const CreateAirFreightSchema = z.object({
  price_45K: z.number().min(0),
  price_100K: z.number().min(0),
  price_300K: z.number().min(0),
  price_500K: z.number().min(0),
  FSC: z.number().min(0),
  AMS_Fees: z.number().min(0),
  SCC: z.string().min(1),
  routine: z.string().min(1),
  freight_id: z.string().min(0)
});

export type CreateAirFreightDto = z.infer<typeof CreateAirFreightSchema>;
