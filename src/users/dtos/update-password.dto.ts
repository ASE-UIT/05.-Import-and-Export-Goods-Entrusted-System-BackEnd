import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdatePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(1).max(64),
});

export class UpdatePasswordDto extends createZodDto(UpdatePasswordSchema) {}
