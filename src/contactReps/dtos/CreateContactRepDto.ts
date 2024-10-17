import { z } from 'zod';

export const CreateContactRepSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email().min(1),
});

export type CreateContactRepDto = z.infer<typeof CreateContactRepSchema>;
