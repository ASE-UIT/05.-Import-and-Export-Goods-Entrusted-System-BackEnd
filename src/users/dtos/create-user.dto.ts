import { RoleEnum } from '@/shared/enums/roles.enum';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Password validation constants
const PASSWORD_REQUIREMENTS = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 64,
  PATTERNS: {
    UPPERCASE: /[A-Z]/,
    LOWERCASE: /[a-z]/,
    NUMBER: /[0-9]/,
    SPECIAL: /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/,
  },
} as const;

const countCharacterTypes = (password: string) => {
  return Object.entries(PASSWORD_REQUIREMENTS.PATTERNS).reduce(
    (acc, [key, pattern]) => ({
      ...acc,
      [key.toLowerCase()]: [...password].filter((ch) => pattern.test(ch))
        .length,
    }),
    {} as Record<string, number>,
  );
};

export const CreateUserSchema = z
  .object({
    username: z
      .string()
      .min(1, 'Username is required')
      .max(16, 'Username must not exceed 16 characters')
      .describe("The user's username"),

    password: z
      .string()
      .min(
        PASSWORD_REQUIREMENTS.MIN_LENGTH,
        'Password must be at least 8 characters',
      )
      .max(
        PASSWORD_REQUIREMENTS.MAX_LENGTH,
        'Password must not exceed 64 characters',
      )
      .describe(
        'Additional requirement: Must have at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),

    role: z
      .nativeEnum(RoleEnum)
      .describe('The user role. Cannot be ADMIN')
      .refine((role) => {
        if (role === RoleEnum.ADMIN) {
          return false;
        }

        return true;
      }, 'Admin role cannot be assigned to users using the public API. Contact a system administrator for assistance.'),

    employeeId: z
      .string({
        required_error: 'Employee ID is required',
        invalid_type_error: 'Employee ID must be a string',
      })
      .uuid('Invalid employee ID format')
      .describe('The employee ID associated with the user'),
  })
  .superRefine(({ password }, ctx) => {
    const counts = countCharacterTypes(password);

    const requirements = [
      {
        check: counts.lowercase < 1,
        message: 'Password must contain at least one lowercase letter',
      },
      {
        check: counts.uppercase < 1,
        message: 'Password must contain at least one uppercase letter',
      },
      {
        check: counts.number < 1,
        message: 'Password must contain at least one number',
      },
      {
        check: counts.special < 1,
        message: 'Password must contain at least one special character',
      },
    ];

    requirements.forEach(({ check, message }) => {
      if (check) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message,
          path: ['password'],
        });
      }
    });
  });

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
