import { UpdateCustomerDto } from '@/customers/dtos/UpdateUserDto';
import { Customer } from '@/customers/models/customer.model';
import { User } from '@/users/models/user.model';

export interface IUpdateCustomerStrategy {
  update(customerId: string, udpateInfo: UpdateCustomerDto): Promise<Customer>;
}
