import { ConflictException, Injectable } from '@nestjs/common';
import { ICreateCustomerStrategy } from './create-customer-strategy.interface';
import { Customer } from '@/customers/models/customer.model';
import { UniqueConstraintError } from 'sequelize';
import { CreateCustomerDto } from '@/customers/dtos/create-customer.dto';

@Injectable()
export class CreateCustomerStrategy implements ICreateCustomerStrategy {
  async create(customerInfo: CreateCustomerDto): Promise<Customer> {
    // Create a new customer
    const customer = new Customer();
    customer.name = customerInfo.name;
    customer.shortName = customerInfo.shortName;
    customer.email = customerInfo.email;
    customer.phone = customerInfo.phone;
    customer.address = customerInfo.address;
    customer.taxId = customerInfo.taxId;
    try {
      await customer.save();
      return customer;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}
