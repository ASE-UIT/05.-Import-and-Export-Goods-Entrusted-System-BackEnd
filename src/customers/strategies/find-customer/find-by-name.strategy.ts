import { Injectable } from '@nestjs/common';
import { IFindCustomerStrategy } from './find-customer-strategy.interface';
import { Customer } from '@/customers/models/customer.model';

@Injectable()
export class FindCustomerByNameStrategy implements IFindCustomerStrategy {
  async find(customerName: string): Promise<Customer[] | null> {
    return Customer.findAll({
      where: { name: customerName },
    });
  }
}
