import { z } from 'zod';

export const UpdateLegalRepSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().min(1),
  customerId: z.string().min(1),
});

export type UpdateLegalRepDto = z.infer<typeof UpdateLegalRepSchema>;
