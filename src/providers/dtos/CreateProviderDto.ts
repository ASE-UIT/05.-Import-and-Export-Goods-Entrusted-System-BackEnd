import { z } from 'zod';
import { ProviderStatus } from '@/providers/models/provider.model';

export const CreateProviderSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  phone: z.string(),
  address: z.string().min(1),
  country: z.string().min(1),
  status: z.nativeEnum(ProviderStatus).default(ProviderStatus.ACTIVE), 
});

export type CreateProviderDto = z.infer<typeof CreateProviderSchema>;
