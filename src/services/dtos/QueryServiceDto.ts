import { z } from 'zod';

export const QueryServiceSchema = z.object({
  name: z.string().min(1).optional(),
  shortName: z.string().min(1).optional(),
  fee: z.coerce.number().gt(0).optional(),
});

export type QueryServiceDto = z.infer<typeof QueryServiceSchema>;
