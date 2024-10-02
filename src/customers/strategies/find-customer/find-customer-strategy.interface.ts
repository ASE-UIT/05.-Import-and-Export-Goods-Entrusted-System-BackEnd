import { Customer } from '@/customers/models/customer.model';

export interface IFindCustomerStrategy {
  find(customerInfo: string): Promise<Customer | null>;
}
