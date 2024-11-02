import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateDocumentSchema = z.object({
  shipmentId: z.string().uuid(),
  type: z.string().min(1),
  image: z.string().min(1),
  docNumber: z.number().min(1),
});

export class CreateDocumentDto extends createZodDto(CreateDocumentSchema) {}
export class UpdateDocumentDto extends createZodDto(
  CreateDocumentSchema.partial().omit({ shipmentId: true }),
) {}
