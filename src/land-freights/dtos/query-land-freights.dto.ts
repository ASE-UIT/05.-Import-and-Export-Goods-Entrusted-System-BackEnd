import { z } from 'zod';

export const QueryLandFreightSchema = z.object({
  price_0_100: z.coerce.number().min(0).optional(),
  price_100_200: z.coerce.number().min(0).optional(),
  price_200_500: z.coerce.number().min(0).optional(),
  price_500_1500: z.coerce.number().min(0).optional(),
  price_1500_5000: z.coerce.number().min(0).optional(),
  price_5000_10000: z.coerce.number().min(0).optional(),
  price_10000: z.coerce.number().min(0).optional(),
  freight_id: z.string().min(0).uuid().optional(),
  land_freight_id: z.string().min(0).uuid().optional(),
});

export type QueryLandFreightDto = z.infer<typeof QueryLandFreightSchema>;