import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { User } from '@/users/models/user.model';

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
    // if (customer.length === 0)
    //   throw new NotFoundException('Customer does not exits'); // if customer is not found
    // if (customer.length > 1)
    //   return customer; // if multiple customers are found
    // else return customer[0]; // if only one customer is found
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
  async createCustomer(customerInfo: CreateCustomerDto): Promise<void> {
    const customerExists = await this.checkDuplicate(customerInfo.name);
    if (!customerExists) {
      return await this.createCustomerStrategy.create(customerInfo);
    } else {
      throw new ConflictException('Customer already exists');
    }
  }

  async checkDuplicate(name: string): Promise<boolean> {
    const exists = await this.findCustomer(FindCustomerStrategy.NAME, name);
    return exists.length > 0 ? true : false;
  }

  // updating services
  async updateCustomer(
    customerID: string,
    udpateInfo: Partial<CreateCustomerDto>,
  ): Promise<{ message: string; updatedData: Customer }> {
    const customerExists = await Customer.findOne({
      where: { id: customerID },
    });
    if (!customerExists) {
      throw new NotFoundException('Customer does not exist');
    }
    const updatedResponse = await this.updateCustomerStrategy.update(
      customerID,
      udpateInfo,
    );
    return { message: 'Customer updated', updatedData: updatedResponse };
  }
}
