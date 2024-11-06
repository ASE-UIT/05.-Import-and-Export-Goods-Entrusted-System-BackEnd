import { z } from 'zod';
import { Position } from '../models/employee.model';

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

export type CreateEmployeeDto = z.infer<typeof CreateEmployeeSchema>;
