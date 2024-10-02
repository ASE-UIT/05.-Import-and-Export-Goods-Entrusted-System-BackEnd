import { z } from 'zod';

export const CreateRoleSchema = z.object({
  roleName: z.string().min(1).max(16).toUpperCase(),
});

export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;
