import { z } from 'zod';
import { Position } from '../models/employee.model';
import { createZodDto } from 'nestjs-zod';

export const CreateEmployeeSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  position: z.string().toUpperCase().pipe(z.nativeEnum(Position)),
  dob: z.coerce.date(),
  coefficientSalary: z.number().positive(),
  baseSalary: z.number().nonnegative(),
});

export class CreateEmployeeDto extends createZodDto(CreateEmployeeSchema) {}
export class UpdateEmployeeDto extends createZodDto(
  CreateEmployeeSchema.partial(),
) {}
