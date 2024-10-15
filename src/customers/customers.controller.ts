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
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { FindCustomerStrategy } from './strategies/find-customer/find-customer-strategy.enum';
import { ZodValidationPipe } from '@/shared/pipes/zod.pipe';
import { QueryCustomerDto, QueryCustomerSchema } from './dtos/QueryCustomerDto';
import {
  CreateCustomerDto,
  CreateCustomerSchema,
} from './dtos/CreateCustomerDto';

@Controller({
  path: 'customers',
  version: '1',
})
export class CustomersController {
  constructor(private customerService: CustomersService) {}

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

  @Post()
  async createCustomer(
    @Body(new ZodValidationPipe(CreateCustomerSchema)) body: CreateCustomerDto,
  ) {
    const createRes = await this.customerService.createCustomer(body);
    return { message: `Customer created`, data: createRes };
  }

  @Patch(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CreateCustomerSchema.partial()))
    body: Partial<CreateCustomerDto>,
  ) {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Body is empty');
    const updateResponse = await this.customerService.updateCustomer(id, body);
    return updateResponse;
  }
}
