import { RoleEnum } from '@/shared/enums/roles.enum';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  username: z.string().min(1).max(16).describe("The user's username"),
  password: z.string().min(1).max(64).describe("The user's password"),
  role: z.nativeEnum(RoleEnum),
  employeeId: z
    .string({
      message: 'An employee association is needed to create an account',
    })
    .uuid()
    .describe('The employee ID associated with the user'),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
