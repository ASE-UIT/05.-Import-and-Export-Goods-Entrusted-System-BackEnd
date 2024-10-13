import { z } from 'zod';

export const QueryAirFreightSchema = z.object({
  '45K': z.number().optional(),
  '100K': z.number().optional(),
  '300K': z.number().optional(),
  '500K': z.number().optional(),
  FSC: z.number().optional(),
  AMS_Fees: z.number().optional(),
  SCC: z.string().optional(),
  routine: z.string().optional(),
  freight_id: z.string().optional(),
});

export type QueryAirFreightDto = z.infer<typeof QueryAirFreightSchema>;
