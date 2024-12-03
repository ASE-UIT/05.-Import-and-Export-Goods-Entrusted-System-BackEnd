import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).describe('Page'),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(50)
    .describe('Number of records per page'),
});

export class PaginationDto extends createZodDto(PaginationSchema) {}
