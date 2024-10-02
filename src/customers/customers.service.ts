import { Injectable } from '@nestjs/common';
import { FindCustomerByNameStrategy } from './strategies/find-customer/find-by-name.strategy';
import { FindCustomerByEmailStrategy } from './strategies/find-customer/find-by-email.strategy';
import { FindCustomerByPhoneStrategy } from './strategies/find-customer/find-by-phone.strategy';
import { FindCustomerStrategy } from './strategies/find-customer/find-customer-strategy.enum';
import { IFindCustomerStrategy } from './strategies/find-customer/find-customer-strategy.interface';
import { Customer } from './models/customer.model';

@Injectable()
export class CustomersService {
  constructor(
    private findCustomerByNameStraregy: FindCustomerByNameStrategy,
    private findCustomerByEmailStrategy: FindCustomerByEmailStrategy,
    private findCustomerByPhoneStrategy: FindCustomerByPhoneStrategy,
  ) {}
  async findCustomer(
    strategy: FindCustomerStrategy,
    customerInfo: string,
  ): Promise<Customer | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const customer: Customer | null = await findStrategy.find(customerInfo);
    return customer;
  }

  getFindStrategy(strategy: FindCustomerStrategy): IFindCustomerStrategy {
    switch (strategy) {
      case FindCustomerStrategy.EMAIL:
        return this.findCustomerByEmailStrategy;
      case FindCustomerStrategy.NAME:
        return this.findCustomerByNameStraregy;
      case FindCustomerStrategy.PHONE:
        return this.findCustomerByPhoneStrategy;
    }
  }
}
