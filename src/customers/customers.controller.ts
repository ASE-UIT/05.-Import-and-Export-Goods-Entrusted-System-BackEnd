import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
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
  ApiTags,
  ApiUnauthorizedResponse,
  PartialType,
} from '@nestjs/swagger';

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
  @ApiOkResponse({ description: 'Customer found' })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
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
  @ApiBody({
    type: CreateCustomerDto,
  })
  @ApiCreatedResponse({ description: 'New customer created' })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiConflictResponse({ description: 'Unique information already exist' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
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
    return { message: `Customer created`, data: createRes };
  }

  @ApiOperation({ summary: "Update customer's information" })
  @ApiOkResponse({ description: 'New information updated' })
  @ApiBadRequestResponse({ description: 'Empty body or misspelled property' })
  @ApiNotFoundResponse({ description: 'Could not find customer to update' })
  @ApiUnauthorizedResponse({
    description: 'Not logged in or account has unappropriate role',
  })
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
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong. Contact backend team at once',
  })
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
    return updateResponse;
  }
}
