import { CreateCustomerDto } from '@/customers/dtos/CreateCustomerDto';

export interface ICreateCustomerStrategy {
  create(customerInfo: CreateCustomerDto): Promise<void>;
}
