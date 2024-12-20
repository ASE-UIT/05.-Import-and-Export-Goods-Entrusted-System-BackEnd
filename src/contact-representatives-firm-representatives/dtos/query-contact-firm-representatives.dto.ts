import { z } from 'zod';

export const QueryContactRepFirmRepSchema = z.object({
  contactRepId: z.string().min(1).uuid().optional().describe("Search by Contact Representative's ID"),
  id: z.string().min(1).uuid().optional(),
  firmRepId: z.string().min(1).uuid().optional().describe("Search by Firm Representative's ID"),
});

export type QueryContactRepFirmRepDto = z.infer<typeof QueryContactRepFirmRepSchema>;
