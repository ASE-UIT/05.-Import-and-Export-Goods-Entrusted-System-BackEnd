import { z } from 'zod';

export const UpdateProviderSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().min(1),
  address: z.string().min(1),
  country: z.string().min(1),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export type UpdateProviderDto = z.infer<typeof UpdateProviderSchema>;

