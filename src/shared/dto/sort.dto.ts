import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { Sort } from '../enums/sort.enum';

export const SortSchema = z.object({
  sortOrder: z.nativeEnum(Sort),
  sortBy: z.string().min(1),
});

export class SortDto extends createZodDto(SortSchema) {}
