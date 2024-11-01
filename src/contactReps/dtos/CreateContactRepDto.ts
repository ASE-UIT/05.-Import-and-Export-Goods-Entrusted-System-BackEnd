import { PartialType } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateContactRepSchema = z.object({
  name: z.string().min(1).describe("Contact representative's name"),
  phone: z.string().min(1).describe("Contact representative's phone number"),
  email: z.string().email().min(1).describe("Contact representative's email"),
});

export class CreateContactRepDto extends createZodDto(CreateContactRepSchema) {}
export class UpdateContactRepDto extends createZodDto(CreateContactRepSchema.partial()) {}
