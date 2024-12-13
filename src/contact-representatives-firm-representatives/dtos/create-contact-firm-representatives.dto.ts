import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateContactRepFirmRepSchema = z.object({
  contactRepId: z.string().min(1).uuid().describe("Contact representative's ID"),
  firmRepId: z.string().min(1).uuid().describe("Firm representative's ID"),
});

export class CreateContactRepFirmRepDto extends createZodDto(CreateContactRepFirmRepSchema) {}
export class UpdateContactRepFirmRepDto extends createZodDto(CreateContactRepFirmRepSchema.partial()) {}