import { CreateCustomerDto } from '@/customers/dtos/create-customer.dto';
import { Customer } from '@/customers/models/customer.model';

export interface ICreateCustomerStrategy {
  create(customerInfo: CreateCustomerDto): Promise<Customer>;
}
