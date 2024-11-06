import { string, z } from 'zod';

export const CreateLandFreightSchema = z.object({
  price_0_100: z.number().min(0),
  price_100_200: z.number().min(0),
  price_200_500: z.number().min(0),
  price_500_1500: z.number().min(0),
  price_1500_5000: z.number().min(0),
  price_5000_10000: z.number().min(0),
  price_10000: z.number().min(0),
  freight_id: z.string().min(0),
});

export type CreateLandFreightDto = z.infer<typeof CreateLandFreightSchema>;
