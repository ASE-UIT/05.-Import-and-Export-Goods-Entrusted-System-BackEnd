import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUpdateCustomerStrategy } from './update-customer-strategy.interface';
import { Customer } from '@/customers/models/customer.model';
import { CreateCustomerDto } from '@/customers/dtos/CreateCustomerDto';
import { UniqueConstraintError } from 'sequelize';

@Injectable()
export class UpdateCustomerStrategy implements IUpdateCustomerStrategy {
  async update(
    customerId: string,
    updateInfo: Partial<CreateCustomerDto>,
  ): Promise<Customer> {
    try {
      const [affectedRows, [updateData]] = await Customer.update(
        { ...updateInfo },
        { where: { id: customerId }, returning: true },
      );
      return updateData.dataValues as Customer;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Customer not found');
      }
      if (err instanceof UniqueConstraintError) {
        throw new ConflictException(err.errors[0].message);
      }
    }
  }
}
