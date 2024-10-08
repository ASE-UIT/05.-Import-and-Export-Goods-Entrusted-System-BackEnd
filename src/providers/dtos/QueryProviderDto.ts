import { z } from 'zod';

export const QueryProviderSchema = z.object({
  all: z.string().optional(),
  email: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
});

export type QueryProviderDto = z.infer<typeof QueryProviderSchema>;
