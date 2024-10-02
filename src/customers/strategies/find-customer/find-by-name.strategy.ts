import { Injectable } from '@nestjs/common';
import { IFindCustomerStrategy } from './find-customer-strategy.interface';
import { Customer } from '@/customers/models/customer.model';

@Injectable()
export class FindCustomerByNameStrategy implements IFindCustomerStrategy {
  find(customerName: string): Promise<Customer | null> {
    return Customer.findOne({ where: { name: customerName } });
  }
}
