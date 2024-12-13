import { Role } from '@/roles/models/role.model';
import { DocumentType } from '@/shared/enums/document-type.enum';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { User } from '@/users/models/user.model';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateDocumentSchema = z.object({
  shipmentId: z.string().uuid(),
  type: z.nativeEnum(DocumentType),
  image: z.string().min(1),
  docNumber: z.number().min(1),
  //userId: z.string().uuid(),
});

export class CreateDocumentDto extends createZodDto(CreateDocumentSchema) {}
export class UpdateDocumentDto extends createZodDto(
  CreateDocumentSchema.partial().omit({ shipmentId: true }),
) {}
