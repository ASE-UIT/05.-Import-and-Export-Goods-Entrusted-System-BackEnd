import { Injectable } from '@nestjs/common';
import { IUpdateCustomerStrategy } from './update-customer-strategy.interface';
import { UpdateCustomerDto } from '@/customers/dtos/UpdateUserDto';
import { Customer } from '@/customers/models/customer.model';

@Injectable()
export class UpdateCustomerStrategy implements IUpdateCustomerStrategy {
  async update(
    customerId: string,
    updateInfo: UpdateCustomerDto,
  ): Promise<Customer> {
    const [affectedRows, [updateData]] = await Customer.update(
      { ...updateInfo },
      { where: { id: customerId }, returning: true },
    );
    return updateData.dataValues as Customer;
  }
}
