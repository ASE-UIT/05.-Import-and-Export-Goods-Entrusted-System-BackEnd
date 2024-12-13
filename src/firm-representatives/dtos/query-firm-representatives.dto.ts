import { z } from 'zod';

export const QueryFirmRepSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  id: z.string().min(1).uuid().optional(),
});

export type QueryFirmRepDto = z.infer<typeof QueryFirmRepSchema>;
