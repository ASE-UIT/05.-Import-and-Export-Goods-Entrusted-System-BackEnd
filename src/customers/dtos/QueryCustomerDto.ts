import { z } from 'zod';

export const QueryCustomerSchema = z.object({
  all: z.string().optional(),
  email: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
});

export type QueryCustomerDto = z.infer<typeof QueryCustomerSchema>;
