import { PartialType } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateCustomerSchema = z.object({
  name: z.string().min(1).describe("Customer's name"),
  shortName: z.string().min(1).describe("Customer's shortname"),
  phone: z.string().min(1).describe("Customer's phone number"),
  email: z.string().email().min(1).describe("Customer's email"),
  address: z.string().min(1).describe("Customer's address"),
  taxId: z.string().min(1).describe("Customer's tax ID"),
  legalRepId: z
    .string()
    .min(1)
    .uuid()
    .optional()
    .describe("The customer's legalRep representative"),
});

export class CreateCustomerDto extends createZodDto(CreateCustomerSchema) {}
export class UpdateCustomerDto extends createZodDto(
  CreateCustomerSchema.partial(),
) {}
