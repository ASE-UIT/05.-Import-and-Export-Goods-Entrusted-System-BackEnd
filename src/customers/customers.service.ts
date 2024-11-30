import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from './models/customer.model';
import { CreateCustomerStrategy } from './strategies/create-customer/create-customer.strategy';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from './dtos/create-customer.dto';
import { UpdateCustomerStrategy } from './strategies/update-customer/update-customer.strategy';
import { QueryCustomerDto } from './dtos/query-customer.dto';
import { LegalRep } from '@/legal-representative/models/legal-rep.model';

@Injectable()
export class CustomersService {
  constructor(
    private createCustomerStrategy: CreateCustomerStrategy,
    private updateCustomerStrategy: UpdateCustomerStrategy,
  ) {}

  async findCustomer(customerInfo: QueryCustomerDto): Promise<Customer[]> {
    let customer: Customer[];
    if (customerInfo) {
      customer = await Customer.findAll({
        where: customerInfo,
        attributes: { exclude: ['legalRepId'] },
        include: LegalRep,
      });
    } else {
      customer = await Customer.findAll({
        include: LegalRep,
        attributes: { exclude: ['legalRepId'] },
      });
    }

    if (customer.length > 0) return customer;
    else throw new NotFoundException('Customer not found');
  }

  // creating services
  async createCustomer(customerInfo: CreateCustomerDto): Promise<Customer> {
    return await this.createCustomerStrategy.create(customerInfo);
  }

  // updating services
  async updateCustomer(
    customerID: string,
    updateInfo: UpdateCustomerDto,
  ): Promise<Customer> {
    const updatedResponse = await this.updateCustomerStrategy.update(
      customerID,
      updateInfo,
    );
    return updatedResponse;
  }
}
