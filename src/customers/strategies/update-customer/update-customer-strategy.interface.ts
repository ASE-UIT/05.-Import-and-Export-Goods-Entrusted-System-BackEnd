import { CreateCustomerDto } from '@/customers/dtos/create-customer.dto';
import { Customer } from '@/customers/models/customer.model';

export interface IUpdateCustomerStrategy {
  update(
    customerId: string,
    udpateInfo: Partial<CreateCustomerDto>,
  ): Promise<Customer>;
}
