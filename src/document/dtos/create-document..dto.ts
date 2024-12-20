import { DocumentType } from '@/shared/enums/document-type.enum';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateDocumentSchema = z.object({
  shipmentId: z
    .string()
    .uuid()
    .describe('The shipment that the document belongs'),
  type: z.nativeEnum(DocumentType).describe('Type of document'),
  docNumber: z.number().min(1).describe("The document's number"),
  //userId: z.string().uuid(),
  fields: z
    .record(z.string(), z.unknown())
    .nullable()
    .optional()
    .describe("The document's information, saved in JSON form"),
  schema: z
    .record(z.string(), z.string())
    .nullable()
    .optional()
    .describe("The schmema of the document's information, saved in JSON form"),
});

export class CreateDocumentDto extends createZodDto(CreateDocumentSchema) {}
export class UpdateDocumentDto extends createZodDto(
  CreateDocumentSchema.partial().omit({ shipmentId: true }),
) {}
