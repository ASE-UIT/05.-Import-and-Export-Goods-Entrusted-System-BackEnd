import { z } from 'zod';

export const CreateCustomerSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().min(1),
  address: z.string().min(1),
  taxId: z.string().min(1),
});

export type CreateCustomerDto = z.infer<typeof CreateCustomerSchema>;
