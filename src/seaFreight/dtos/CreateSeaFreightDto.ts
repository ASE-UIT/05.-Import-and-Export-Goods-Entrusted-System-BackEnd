import { z } from 'zod';

export const CreateSeaFreightSchema = z.object({
  "20DC": z.number().min(0),
  "40DC": z.number().min(0),
  "40HC": z.number().min(0),
  "20RF": z.number().min(0),
  "40RF": z.number().min(0),
  freight_id: z.string().min(1).uuid(),
});

export type CreateSeaFreightDto = z.infer<typeof CreateSeaFreightSchema>;
