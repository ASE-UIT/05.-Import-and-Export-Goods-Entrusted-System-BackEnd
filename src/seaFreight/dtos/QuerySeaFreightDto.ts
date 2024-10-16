import { z } from 'zod';

export const QuerySeaFreightSchema = z.object({
  "20DC": z.number().optional(),
  "40DC": z.number().optional(),
  "40HC": z.number().optional(),
  "20RF": z.number().optional(),
  "40RF": z.number().optional(),
  freight_id: z.string().optional(),
});

export type QuerySeaFreightDto = z.infer<typeof QuerySeaFreightSchema>;
