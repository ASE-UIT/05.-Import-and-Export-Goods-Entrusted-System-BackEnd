import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateServiceSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  fee: z.coerce.number().gt(0),
});

export class CreateServiceDto extends createZodDto(CreateServiceSchema) {}
export class UpdateServiceDto extends createZodDto( CreateServiceSchema.partial()) {}
