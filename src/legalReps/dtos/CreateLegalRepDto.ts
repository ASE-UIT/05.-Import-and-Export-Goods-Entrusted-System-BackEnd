import { z } from 'zod';

export const CreateLegalRepSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().min(1),
  customerId: z.string().min(1).uuid(),
});

export type CreateLegalRepDto = z.infer<typeof CreateLegalRepSchema>
