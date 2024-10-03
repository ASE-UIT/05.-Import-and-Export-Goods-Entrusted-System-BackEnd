import { z } from 'zod';

export const CreateUserSchema = z.object({
  username: z.string().min(1).max(16),
  password: z.string().min(1).max(64),
  employeeId: z
    .string({
      message: 'An employee association is needed to create an account',
    })
    .uuid(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
