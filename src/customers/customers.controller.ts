import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
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
import { UpdateCustomerSchema } from './dtos/UpdateUserDto';
import { Customer } from './models/customer.model';

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
    // Get query fields
    const queryFields: { [key: string]: FindCustomerStrategy } = {
      all: FindCustomerStrategy.ALL,
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

    // const customers = await this.customerService.getAllCustomers(query);
    // if (customers && customers.length > 0) {
    //   return customers;
    // }

    // Cant find customer
    throw new NotFoundException('Customer not found');
  }

  @Post()
  async createCustomer(
    @Body(new ZodValidationPipe(CreateCustomerSchema)) body: CreateCustomerDto,
  ) {
    await this.customerService.createCustomer(body);
    return { message: `Customer created` };
  }

  @Patch(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCustomerSchema.partial()))
    body: Partial<Customer>,
  ) {
    return await this.customerService.updateCustomer(id, body);
  }
}
