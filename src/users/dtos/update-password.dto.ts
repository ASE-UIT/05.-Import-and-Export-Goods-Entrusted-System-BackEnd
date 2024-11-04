import { z } from 'zod';

export const UpdatePasswordSchema = z.object({
  oldPassword: z.string().min(1),
  newPassword: z.string().min(1).max(64),
});

export type UpdatePasswordDto = z.infer<typeof UpdatePasswordSchema>;
