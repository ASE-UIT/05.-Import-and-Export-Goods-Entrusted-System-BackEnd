import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { Sort } from '../enums/sort.enum';

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).describe('Page'),
  limit: z.coerce.number().int().min(1).describe('Number of records per page'),
});

export class PaginationDto extends createZodDto(PaginationSchema) {}
