import { z } from 'zod';

export const QueryDocumentSchema = z.object({
  shipmentId: z.string().uuid(),
  type: z.string(),
  docNumber: z.string(),
});

export type QueryDocumentDto = z.infer<typeof QueryDocumentSchema>;
