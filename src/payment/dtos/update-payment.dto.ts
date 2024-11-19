import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdatePaymentSchema = z.object({});

export class UpdatePaymentDto extends createZodDto(
  UpdatePaymentSchema.partial(),
) {}
