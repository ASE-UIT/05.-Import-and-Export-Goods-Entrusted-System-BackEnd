import { PartialType } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ProviderStatus } from '@/providers/models/provider.model';

export const CreateProviderSchema = z.object({
  name: z.string().min(1).describe("Provider's name"),
  email: z.string().email().min(1).describe("Provider's email"),
  phone: z.string().min(1).describe("Provider's phone number"),
  address: z.string().min(1).describe("Provider's address"),
  country: z.string().min(1).describe("Provider's country"),
  status: z.nativeEnum(ProviderStatus).default(ProviderStatus.ACTIVE), 
  contactRepId: z
    .string()
    .min(1)
    .uuid()
    .optional()
    .describe("The provider's contact representative id"),
});

export class CreateProviderDto extends createZodDto(CreateProviderSchema) {}
export class UpdateProviderDto extends createZodDto(CreateProviderSchema.partial()) {}
