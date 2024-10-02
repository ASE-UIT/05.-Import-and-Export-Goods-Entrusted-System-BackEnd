import { Injectable } from '@nestjs/common';
import { IFindCustomerStrategy } from './find-customer-strategy.interface';
import { Customer } from '@/customers/models/customer.model';

@Injectable()
export class FindCustomerByPhoneStrategy implements IFindCustomerStrategy {
  find(customerPhone: string): Promise<Customer | null> {
    return Customer.findOne({ where: { phone: customerPhone } });
  }
}
