import { Injectable } from '@nestjs/common';
import { FindCustomerByNameStrategy } from './strategies/find-customer/find-by-name.strategy';
import { FindCustomerByEmailStrategy } from './strategies/find-customer/find-by-email.strategy';
import { FindCustomerByPhoneStrategy } from './strategies/find-customer/find-by-phone.strategy';
import { FindCustomerStrategy } from './strategies/find-customer/find-customer-strategy.enum';
import { IFindCustomerStrategy } from './strategies/find-customer/find-customer-strategy.interface';
import { Customer } from './models/customer.model';
import { FindAllCustomerStrategy } from './strategies/find-customer/find-all.strategy';
import { CreateCustomerStrategy } from './strategies/create-customer/create-customer.strategy';
import { CreateCustomerDto } from './dtos/CreateCustomerDto';
import { UpdateCustomerStrategy } from './strategies/update-customer/update-customer.strategy';

@Injectable()
export class CustomersService {
  constructor(
    private findCustomerByNameStraregy: FindCustomerByNameStrategy,
    private findCustomerByEmailStrategy: FindCustomerByEmailStrategy,
    private findCustomerByPhoneStrategy: FindCustomerByPhoneStrategy,
    private findAllCustomerStrategy: FindAllCustomerStrategy,
    private createCustomerStrategy: CreateCustomerStrategy,
    private updateCustomerStrategy: UpdateCustomerStrategy,
  ) {}

  // finding services
  async findCustomer(
    strategy: FindCustomerStrategy,
    customerInfo: string,
  ): Promise<Customer[] | null> {
    const findStrategy = this.getFindStrategy(strategy);
    const customer: Customer[] | null = await findStrategy.find(customerInfo);

    return customer;
  }

  getFindStrategy(strategy: FindCustomerStrategy): IFindCustomerStrategy {
    switch (strategy) {
      case FindCustomerStrategy.ALL:
        return this.findAllCustomerStrategy;
      case FindCustomerStrategy.EMAIL:
        return this.findCustomerByEmailStrategy;
      case FindCustomerStrategy.NAME:
        return this.findCustomerByNameStraregy;
      case FindCustomerStrategy.PHONE:
        return this.findCustomerByPhoneStrategy;
    }
  }

  // creating services
  async createCustomer(customerInfo: CreateCustomerDto): Promise<Customer> {
    return await this.createCustomerStrategy.create(customerInfo);
  }

  // updating services
  async updateCustomer(
    customerID: string,
    updateInfo: Partial<CreateCustomerDto>,
  ): Promise<{ message: string; data: Customer }> {
    const updatedResponse = await this.updateCustomerStrategy.update(
      customerID,
      updateInfo,
    );
    return { message: 'Customer updated', data: updatedResponse };
  }
}
