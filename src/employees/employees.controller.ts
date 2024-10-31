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
  UpdateEmployeeDto,
} from './dtos/CreateEmployeeDto';
import { EmployeesService } from './employees.service';
import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('employees')
@Controller({
  path: 'employees',
  version: '1',
})
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @ApiOperation({ description: 'Create a new employee' })
  @ApiResponse({ status: 201, description: 'Employee successfully created' })
  @ApiResponse({ status: 401, description: 'Not logged in' })
  @ApiResponse({ status: 403, description: 'Not authorized (ADMIN)' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN])
  @Post()
  async createEmployee(
    @Body(new ZodValidationPipe(CreateEmployeeSchema)) body: CreateEmployeeDto,
  ) {
    const employee = await this.employeesService.createEmployee(body);
    return { message: 'Employee successfully created' };
  }

  @ApiOperation({ description: 'Update an employee' })
  @ApiResponse({ status: 201, description: 'Employee successfully created' })
  @ApiResponse({ status: 401, description: 'Not logged in' })
  @ApiResponse({ status: 403, description: 'Not authorized (ADMIN)' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN])
  @Patch(':employeeId')
  async updateEmployee(
    @Param('employeeId') employeeId: string,
    @Body(new ZodValidationPipe(CreateEmployeeSchema.partial()))
    updateDetails: UpdateEmployeeDto,
  ) {
    await this.employeesService.updateEmployee(employeeId, updateDetails);
    return { message: 'Employee successfully updated' };
  }
}
