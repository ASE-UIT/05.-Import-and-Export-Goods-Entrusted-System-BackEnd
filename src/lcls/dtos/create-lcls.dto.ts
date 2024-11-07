import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateLclSchema = z.object({
  cost: z.number().min(0),
  freight_id: z.string().min(0),
});

export class CreateLclDto extends createZodDto(CreateLclSchema) {}
export class UpdateLclDto extends createZodDto(CreateLclSchema.partial()) {}