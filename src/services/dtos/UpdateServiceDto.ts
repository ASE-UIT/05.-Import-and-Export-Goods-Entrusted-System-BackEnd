import { z } from 'zod';

export const UpdateServiceSchema = z.object({
  name: z.string().min(1).optional(),
  shortName: z.string().min(1).optional(),
  fee: z.number().gt(0).optional(),
});

export type UpdateServiceDto = z.infer<typeof UpdateServiceSchema>;
