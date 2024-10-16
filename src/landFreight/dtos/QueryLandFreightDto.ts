import { z } from 'zod';

export const QueryLandFreightSchema = z.object({
  weight: z.number().optional(),
  "100_200": z.number().optional(),
  "200_500": z.number().optional(),
  "500_1500": z.number().optional(),
  "1500_5000": z.number().optional(),
  "5000_10000": z.number().optional(),
  "10000": z.number().optional(),
  freight_id: z.string().optional(),
});

export type QueryLandFreightDto = z.infer<typeof QueryLandFreightSchema>;
