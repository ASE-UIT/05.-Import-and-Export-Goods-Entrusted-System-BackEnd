import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { Body, Controller, Post } from '@nestjs/common';
import {
  CreateEmployeeDto,
  CreateEmployeeSchema,
} from './dtos/CreateEmployeeDto';
import { EmployeesService } from './employees.service';

@Controller({
  path: 'employees',
  version: '1',
})
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @Post()
  async createEmployee(
    @Body(new ZodValidationPipe(CreateEmployeeSchema)) body: CreateEmployeeDto,
  ) {
    const employee = await this.employeesService.createEmployee(body);
    return { message: 'Employee successfully created' };
  }
}
