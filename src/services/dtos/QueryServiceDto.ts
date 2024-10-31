import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QueryServiceSchema = z.object({
  name: z.string().optional(),
  shortName: z.string().optional(),
  fee: z.coerce.number().optional(),
});

export class QueryServiceDto extends createZodDto(QueryServiceSchema) {}
