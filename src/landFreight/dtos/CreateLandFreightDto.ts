import { z } from 'zod';

export const CreateLandFreightSchema = z.object({
  weight: z.number().min(0),
  "100_200": z.number().min(0),
  "200_500": z.number().min(0),
  "500_1500": z.number().min(0),
  "1500_5000": z.number().min(0),
  "5000_10000": z.number().min(0),
  "10000": z.number().min(0),
  freight_id: z.string().min(1).uuid(),
});

export type CreateLandFreightDto = z.infer<typeof CreateLandFreightSchema>;
