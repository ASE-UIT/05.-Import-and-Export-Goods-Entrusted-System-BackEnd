import { z } from 'zod';
import { ProviderStatus } from '@/providers/models/provider.model';

export const UpdateProviderSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().min(1).optional(),
  address: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  status: z.nativeEnum(ProviderStatus).optional(),
});

export type UpdateProviderDto = z.infer<typeof UpdateProviderSchema>;


