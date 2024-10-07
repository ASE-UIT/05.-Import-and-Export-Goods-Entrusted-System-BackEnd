import { z } from 'zod';

export const QueryCustomerSchema = z.object({
  email: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
});

export type QueryCustomerDto = z.infer<typeof QueryCustomerSchema>;
