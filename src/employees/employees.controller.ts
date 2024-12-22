import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
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
import { SuccessResponse } from '@/shared/classes/success-response.class';
import { createResponseType } from '@/shared/helpers/create-response.mixin';
import { ValidationError } from '@/shared/classes/validation-error.class';
import { Employee } from './models/employee.model';

@ApiTags('employees')
@Controller({
  path: 'employees',
  version: '1',
})
export class EmployeesController {
  constructor(private employeesService: EmployeesService) { }

  @ApiOperation({ description: 'Create a new employee' })
  @ApiResponse({
    status: 201,
    description: 'Employee successfully created',
    type: createResponseType('Employee successfully created', Employee),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to create an employee',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only admins can create employees',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN',
    ).getResponse(),
  })
  @ApiResponse({ status: 409, description: 'Conflict', type: ValidationError })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN])
  @Post()
  async createEmployee(
    @Body(new ZodValidationPipe(CreateEmployeeSchema)) body: CreateEmployeeDto,
  ) {
    const employee = await this.employeesService.createEmployee(body);
    return new SuccessResponse('Employee successfully created', employee);
  }

  @ApiOperation({ description: 'Update an employee' })
  @ApiResponse({
    status: 201,
    description: 'Employee successfully updated',
    type: createResponseType('Employee successfully updated', Employee),
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to update an employee',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description: 'Only admins can update employees',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided employeeId does not exist',
    type: NotFoundException,
    example: new NotFoundException('Employee not found').getResponse(),
  })
  @ApiResponse({ status: 409, description: 'Conflict', type: ValidationError })
  @UseGuards(RoleGuard)
  @Roles([RoleEnum.ADMIN])
  @Patch(':employeeId')
  async updateEmployee(
    @Param('employeeId') employeeId: string,
    @Body(new ZodValidationPipe(CreateEmployeeSchema.partial()))
    updateDetails: UpdateEmployeeDto,
  ) {
    const employee = await this.employeesService.updateEmployee(
      employeeId,
      updateDetails,
    );
    return new SuccessResponse('Employee successfully updated', employee);
  }

  @ApiOperation({ description: 'Get all employee' })
  @Get()
  async getAllEmployee() {
    const results = await this.employeesService.getAllEmployee();
    return new SuccessResponse('Success', results);
  }
  @ApiOperation({ description: 'Get employee by id' })
  @Get(':employeeId')
  async getEmployee(@Param('employeeId') employeeId: string) {
    const results = await this.employeesService.getEmployeeById(employeeId);
    return new SuccessResponse('Success', results);
  }
}
