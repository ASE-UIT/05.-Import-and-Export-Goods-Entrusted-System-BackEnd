import { z } from 'zod';
import { ProviderStatus } from '../models/provider.model';

export const QueryProviderSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().min(1).optional(),
  phone: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  status: z.nativeEnum(ProviderStatus).default(ProviderStatus.ACTIVE).optional(), 
  contactRepId: z
    .string()
    .min(1)
    .uuid()
    .optional(),
});

export type QueryProviderDto = z.infer<typeof QueryProviderSchema>;
