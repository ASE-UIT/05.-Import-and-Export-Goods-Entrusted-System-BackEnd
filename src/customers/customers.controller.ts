import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import {
  QueryCustomerDto,
  QueryCustomerSchema,
} from './dtos/query-customer.dto';
import {
  CreateCustomerDto,
  CreateCustomerSchema,
  UpdateCustomerDto,
} from './dtos/create-customer.dto';
import { RoleGuard } from '@/shared/guards/role.guard';
import { Roles } from '@/shared/decorators/role.decorator';
import { RoleEnum } from '@/shared/enums/roles.enum';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessResponse } from '@/shared/classes/success-response.class';
import { createResponseType } from '@/shared/helpers/create-response.mixin';
import { Customer } from './models/customer.model';
import { ValidationError } from '@/shared/classes/validation-error.class';
import { ZodValidationPipe } from 'nestjs-zod';
import { PaginationDto, PaginationSchema } from '@/shared/dto/pagination.dto';
import { Sort } from '@/shared/enums/sort.enum';
import { SortDto, SortSchema } from '@/shared/dto/sort.dto';

@ApiTags('Customers')
@Controller({
  path: 'customers',
  version: '1',
})
export class CustomersController {
  constructor(private customerService: CustomersService) {}

  @ApiOperation({ summary: 'Search for customer' })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Current page',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Total records per page',
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    description: 'Search customer by name',
  })
  @ApiQuery({
    name: 'sortOrder',
    enum: Sort,
    required: false,
    description: 'Sort order',
  })
  @ApiQuery({
    name: 'sortBy',
    type: String,
    required: false,
    description: 'Attribute to sort',
  })
  @ApiQuery({
    name: 'phone',
    type: String,
    required: false,
    description: 'Search customer by phone number',
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: false,
    description: 'Search customer by email',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Customer,
  })
  @ApiResponse({
    status: 400,
    description: 'Unrecognized key(s) in query',
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find customer's information",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | MANAGER] can perform this action',
    type: ForbiddenException,

    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, SALES, CUSTOMER_SERVICE, MANAGER',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
    type: NotFoundException,
    example: new NotFoundException('Customer not found').getResponse(),
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.MANAGER,
  ])
  @Get()
  async getCustomers(
    @Query(new ZodValidationPipe(QueryCustomerSchema))
    query: QueryCustomerDto,
    @Query(new ZodValidationPipe(PaginationSchema.partial()))
    pagination: Partial<PaginationDto>,
    @Query(new ZodValidationPipe(SortSchema.partial()))
    sort: Partial<SortDto>,
  ) {
    const result = await this.customerService.findCustomer(
      query,
      pagination,
      sort,
    );
    return new SuccessResponse('Success', result);
  }

  @ApiOperation({ summary: 'Search for customer by id' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: Customer,
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find customer's information",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | MANAGER] can perform this action',
    type: ForbiddenException,

    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, SALES, CUSTOMER_SERVICE, MANAGER',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
    type: NotFoundException,
    example: new NotFoundException('Customer not found').getResponse(),
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.MANAGER,
  ])
  @Get(':id')
  async getCustomersById(
    @Param('id')
    id: string,
  ) {
    const result = await this.customerService.findCustomerById(id);
    return new SuccessResponse('Success', result);
  }

  @ApiOperation({ summary: 'Create new customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer created',
    type: createResponseType('Customer created', Customer),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description: 'Authentication is required to create a customer',
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, SALES, CUSTOMER_SERVICE, MANAGER',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided customer information does not exist',
    type: NotFoundException,
    example: new NotFoundException(
      'Legal representative id not found',
    ).getResponse(),
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ValidationError,
  })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.MANAGER,
  ])
  @Post()
  async createCustomer(
    @Body(new ZodValidationPipe(CreateCustomerSchema)) body: CreateCustomerDto,
  ) {
    const createRes = await this.customerService.createCustomer(body);
    return new SuccessResponse(`Customer created`, createRes);
  }

  @ApiOperation({ summary: "Update customer's information" })
  @ApiBody({
    type: UpdateCustomerDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Customer updated',
    type: createResponseType('Customer updated', Customer),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request body',
    type: ValidationError,
  })
  @ApiResponse({
    status: 401,
    description:
      "Authentication is required to update a customer's information",
    type: UnauthorizedException,
    example: new UnauthorizedException(
      'Only authenticated users can access this resource',
    ).getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException(
      'Only users with the following roles can access this resource: ADMIN, SALES, CUSTOMER_SERVICE, MANAGER',
    ).getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided customer information does not exist',
    type: NotFoundException,
    example: new NotFoundException('Customer id not found').getResponse(),
  })
  @ApiResponse({ status: 409, description: 'Conflict', type: ValidationError })
  @UseGuards(RoleGuard)
  @Roles([
    RoleEnum.ADMIN,
    RoleEnum.SALES,
    RoleEnum.CUSTOMER_SERVICE,
    RoleEnum.MANAGER,
  ])
  @Patch(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCustomerDto))
    body: UpdateCustomerDto,
  ) {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Body is empty or invalid field names');
    const updateResponse = await this.customerService.updateCustomer(id, body);
    return new SuccessResponse('Customer updated', updateResponse);
  }
}
