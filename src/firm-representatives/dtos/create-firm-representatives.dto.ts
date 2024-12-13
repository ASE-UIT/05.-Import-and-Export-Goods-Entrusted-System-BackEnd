import { PartialType } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateFirmRepSchema = z.object({
  name: z.string().min(1).describe("Firm representative's name"),
  phone: z.string().min(1).describe("Firm representative's phone number"),
  email: z.string().email().min(1).describe("Firm representative's email"),
});

export class CreateFirmRepDto extends createZodDto(CreateFirmRepSchema) {}
export class UpdateFirmRepDto extends createZodDto(CreateFirmRepSchema.partial()) {}
