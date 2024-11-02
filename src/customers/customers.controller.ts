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
import { FindCustomerStrategy } from './strategies/find-customer/find-customer-strategy.enum';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
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
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  PartialType,
} from '@nestjs/swagger';
import { SuccessResponse } from '@/shared/classes/success-response.class';
import { createResponseType } from '@/shared/helpers/create-response.mixin';
import { Customer } from './models/customer.model';
import { ValidationError } from '@/shared/classes/validation-error.class';

@ApiTags('Customers')
@Controller({
  path: 'customers',
  version: '1',
})
export class CustomersController {
  constructor(private customerService: CustomersService) {}

  @ApiOperation({ summary: 'Search for customers' })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    description: 'Search customer by name',
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
    description: 'Customer founded',
    example: {
      id: 'b7a301b9-7dc7-4c1b-828e-effdea663335',
      name: 'customer1',
      shortName: 'cus1',
      email: 'cus1@example.com',
      phone: '123456',
      address: 'cus1.st',
      taxId: '123456',
      legalRepId: '112fad97-b247-49f8-855c-65b22dab4189',
      createdAt: '2024-10-24T14:29:00.452Z',
      updatedAt: '2024-10-24T14:33:15.890Z',
    },
  })
  @ApiResponse({
    status: 401,
    description: "Authentication is required to find customer's information",
    type: UnauthorizedException,
    example: new UnauthorizedException().getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | MANAGER] can perform this action',
    type: ForbiddenException,

    example: new ForbiddenException().getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
    type: NotFoundException,
    example: new NotFoundException().getResponse(),
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
    @Query(new ZodValidationPipe(QueryCustomerSchema)) query: QueryCustomerDto,
  ) {
    if (Object.keys(query).length === 0)
      return await this.customerService.findCustomer(
        FindCustomerStrategy.ALL,
        '',
      );

    // Get query fields

    const queryFields: { [key: string]: FindCustomerStrategy } = {
      name: FindCustomerStrategy.NAME,
      phone: FindCustomerStrategy.PHONE,
      email: FindCustomerStrategy.EMAIL,
    };

    // Assign corrisponding strategy to query fields
    for (const [key, strategy] of Object.entries(queryFields)) {
      const value = query[key as keyof QueryCustomerDto];
      if (value) {
        const customer = await this.customerService.findCustomer(
          strategy,
          value,
        );
        if (customer.length > 0) {
          if (strategy === FindCustomerStrategy.ALL || customer.length > 1)
            return customer;
          else return customer[0];
        }
      }
    }

    // Cant find customer
    throw new NotFoundException('Customer not found');
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
    example: new UnauthorizedException().getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException().getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided customer information does not exist',
    type: NotFoundException,
    example: new NotFoundException().getResponse(),
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
    examples: {
      example: {
        description: 'Able to update one or more fields in CreateCustomerDto',
        value: {
          name: 'Updated name',
          phone: '123456',
          email: 'UpdatedEmail@example.com',
        },
      },
    },
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
    example: new UnauthorizedException().getResponse(),
  })
  @ApiResponse({
    status: 403,
    description:
      'Only user with role: [ADMIN | SALES | CUSTOMER_SERVICE | MANAGER] can perform this action',
    type: ForbiddenException,
    example: new ForbiddenException().getResponse(),
  })
  @ApiResponse({
    status: 404,
    description: 'The provided customer information does not exist',
    type: NotFoundException,
    example: new NotFoundException().getResponse(),
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
    @Body(
      new ZodValidationPipe(
        CreateCustomerSchema.partial().omit({ legalRepId: true }),
      ),
    )
    body: Partial<CreateCustomerDto>,
  ) {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Body is empty or invalid field names');
    const updateResponse = await this.customerService.updateCustomer(id, body);
    return new SuccessResponse('Customer updated', updateResponse);
  }
}
