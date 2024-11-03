import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUpdateCustomerStrategy } from './update-customer-strategy.interface';
import { Customer } from '@/customers/models/customer.model';
import { UniqueConstraintError } from 'sequelize';
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from '@/customers/dtos/create-customer.dto';
import { InjectModel } from '@nestjs/sequelize';
import {
  ValidationError,
  ValidationErrorDetail,
} from '@/shared/classes/validation-error.class';

@Injectable()
export class UpdateCustomerStrategy implements IUpdateCustomerStrategy {
  constructor(
    @InjectModel(Customer)
    private customerModel: typeof Customer,
  ) {}
  async update(
    customerId: string,
    updateInfo: UpdateCustomerDto,
  ): Promise<Customer> {
    try {
      const [affectedRows, [updateData]] = await this.customerModel.update(
        { ...updateInfo },
        { where: { id: customerId }, returning: true },
      );
      return updateData.dataValues as Customer;
    } catch (err) {
      if (err instanceof TypeError) {
        throw new NotFoundException('Customer not found');
      }
      if (err instanceof UniqueConstraintError) {
        const errors = err.errors.map(
          (error) => new ValidationErrorDetail(error.path, error.message),
        );
        throw new ConflictException(new ValidationError(errors));
      }
    }
  }
}
