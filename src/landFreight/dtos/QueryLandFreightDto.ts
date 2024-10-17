import { z } from 'zod';

export const QueryLandFreightSchema = z.object({
  weight: z.number().optional(),
  price_100_200: z.number().optional(),
  price_200_500: z.number().optional(),
  price_500_1500: z.number().optional(),
  price_1500_5000: z.number().optional(),
  price_5000_10000: z.number().optional(),
  price_10000: z.number().optional(),
});

export type QueryLandFreightDto = z.infer<typeof QueryLandFreightSchema>;
