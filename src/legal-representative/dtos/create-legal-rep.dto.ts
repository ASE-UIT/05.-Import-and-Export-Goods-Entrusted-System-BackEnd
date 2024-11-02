import { PartialType } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateLegalRepSchema = z.object({
  name: z.string().min(1).describe("Legal representative's name"),
  phone: z.string().min(1).describe("Legal representative's phone number"),
  email: z.string().email().min(1).describe("Legal representative's email"),
  customerId: z
    .string()
    .min(1)
    .uuid()
    .describe('The customer the legalRep represents'),
});

export class CreateLegalRepDto extends createZodDto(CreateLegalRepSchema) {}
export class UpdateLegalRepDto extends createZodDto(
  CreateLegalRepSchema.partial(),
) {}
