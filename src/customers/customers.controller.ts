import { Controller, Get, Query } from '@nestjs/common';
import { Customer } from './models/customer.model';
import { CustomersService } from './customers.service';
import { FindCustomerStrategy } from './strategies/find-customer/find-customer-strategy.enum';

@Controller({
  path: 'customers',
  version: '1',
})
export class CustomersController {
  constructor(private customerService: CustomersService) {}
  @Get()
  async getCustomersByName(
    @Query(new ZodValidationPipe(schema)) name: QueryCustomerDto,
  ) {
    return await this.customerService.findCustomer(
      FindCustomerStrategy.NAME,
      name,
    );
  }
}
