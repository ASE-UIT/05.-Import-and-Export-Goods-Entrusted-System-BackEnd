import { Injectable } from '@nestjs/common';
import { IFindCustomerStrategy } from './find-customer-strategy.interface';
import { Customer } from '@/customers/models/customer.model';

@Injectable()
export class FindCustomerByEmailStrategy implements IFindCustomerStrategy {
  async find(customerEmail: string): Promise<Customer[] | null> {
    return Customer.findAll({ where: { email: customerEmail } });
  }
}
