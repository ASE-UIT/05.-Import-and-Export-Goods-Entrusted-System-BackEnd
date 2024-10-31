import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateEmployeeDto,
  CreateEmployeeSchema,
} from './dtos/CreateEmployeeDto';
import { EmployeesService } from './employees.service';
import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';

@Controller({
  path: 'employees',
  version: '1',
})
export class EmployeesController {
  constructor(private employeesService: EmployeesService) { }

  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN])
  @Post()
  async createEmployee(
    @Body(new ZodValidationPipe(CreateEmployeeSchema)) body: CreateEmployeeDto,
  ) {
    const employee = await this.employeesService.createEmployee(body);
    return { message: 'Employee successfully created' };
  }

  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN])
  @Patch(':employeeId')
  async updateEmployee(
    @Param('employeeId') employeeId: string,
    @Body(new ZodValidationPipe(CreateEmployeeSchema.partial()))
    updateDetails: Partial<CreateEmployeeDto>,
  ) {
    await this.employeesService.updateEmployee(employeeId, updateDetails);
    return { message: 'Employee successfully updated' };
  }
}
