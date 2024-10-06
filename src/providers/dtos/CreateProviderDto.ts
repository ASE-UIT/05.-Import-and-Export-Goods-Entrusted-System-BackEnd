import { z } from 'zod';

export const CreateProviderSchema = z.object({
  name: z.string().min(1),        
  email: z.string().email().min(1),
  phone: z.string(),              
  address: z.string().min(1),
  country: z.string().min(1),  
  status: z.enum(['active', 'inactive']).default('active'),
});

export type CreateProviderDto = z.infer<typeof CreateProviderSchema>;
