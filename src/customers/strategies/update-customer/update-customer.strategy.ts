import { BadRequestException, Injectable } from '@nestjs/common';
import { IUpdateCustomerStrategy } from './update-customer-strategy.interface';
import { Customer } from '@/customers/models/customer.model';
import { CreateCustomerDto } from '@/customers/dtos/CreateCustomerDto';

@Injectable()
export class UpdateCustomerStrategy implements IUpdateCustomerStrategy {
  async update(
    customerId: string,
    updateInfo: Partial<CreateCustomerDto>,
  ): Promise<Customer> {
    const [affectedRows, [updateData]] = await Customer.update(
      { ...updateInfo },
      { where: { id: customerId }, returning: true },
    );
    if (affectedRows === 0)
      throw new BadRequestException("Customer doesn't exist");
    return updateData.dataValues as Customer;
  }
}
