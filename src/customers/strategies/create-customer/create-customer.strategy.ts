import { ConflictException, Injectable } from '@nestjs/common';
import { ICreateCustomerStrategy } from './create-customer-strategy.interface';
import { Customer } from '@/customers/models/customer.model';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { CreateCustomerDto } from '@/customers/dtos/create-customer.dto';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class CreateCustomerStrategy implements ICreateCustomerStrategy {
  constructor(
    @InjectModel(Customer)
    private customerModel: typeof Customer,
  ) {}
  async create(customerInfo: CreateCustomerDto): Promise<Customer> {
    // Create a new customer
    try {
      const newCustomer = await this.customerModel.create({
        name: customerInfo.name,
        shortName: customerInfo.shortName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        taxId: customerInfo.taxId,
        legalRepId: customerInfo.legalRepId,
      });
      return newCustomer;
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
      if (err instanceof ForeignKeyConstraintError) {
        throw new ConflictException('Legal representative not found');
      }
    }
  }
}
