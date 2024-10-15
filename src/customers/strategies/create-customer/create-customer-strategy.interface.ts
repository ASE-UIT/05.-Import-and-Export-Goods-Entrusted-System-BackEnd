import { CreateCustomerDto } from '@/customers/dtos/CreateCustomerDto';
import { Customer } from '@/customers/models/customer.model';

export interface ICreateCustomerStrategy {
  create(customerInfo: CreateCustomerDto): Promise<Customer>;
}
