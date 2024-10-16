import { z } from 'zod';

export const CreateAirFreightSchema = z.object({
  "45K": z.number().min(0),
  "100K": z.number().min(0),
  "300K": z.number().min(0),
  "500K": z.number().min(0),
  FSC: z.number().min(0),
  AMS_Fees: z.number().min(0),
  SCC: z.string().min(1),
  routine: z.string().min(1),
  freight_id: z.string().min(1).uuid(),
});

export type CreateAirFreightDto = z.infer<typeof CreateAirFreightSchema>;
