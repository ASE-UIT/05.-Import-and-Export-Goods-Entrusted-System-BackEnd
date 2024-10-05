import { Injectable, NotFoundException } from '@nestjs/common';
import { IFindCustomerStrategy } from './find-customer-strategy.interface';
import { Customer } from '@/customers/models/customer.model';
import { QueryCustomerDto } from '@/customers/dtos/QueryCustomerDto';
import { Not } from 'sequelize-typescript';

@Injectable()
export class FindAllCustomerStrategy {
  async find(customerInfo: string): Promise<Customer[] | null> {
    return customerInfo === 'true' && Customer.findAll();
  }
}
