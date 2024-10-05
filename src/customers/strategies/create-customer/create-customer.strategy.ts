import { Injectable } from '@nestjs/common';
import { ICreateCustomerStrategy } from './create-customer-strategy.interface';
import { CreateCustomerDto } from '@/customers/dtos/CreateCustomerDto';
import { Customer } from '@/customers/models/customer.model';

@Injectable()
export class CreateCustomerStrategy implements ICreateCustomerStrategy {
  async create(customerInfo: CreateCustomerDto): Promise<void> {
    // Create a new customer
    const customer = new Customer();
    customer.name = customerInfo.name;
    customer.shortName = customerInfo.shortName;
    customer.email = customerInfo.email;
    customer.phone = customerInfo.phone;
    customer.address = customerInfo.address;
    customer.taxId = customerInfo.taxId;
    await customer.save();
  }
}
