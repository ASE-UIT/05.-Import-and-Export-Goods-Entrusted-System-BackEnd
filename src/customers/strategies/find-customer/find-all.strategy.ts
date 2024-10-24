import { Injectable, NotFoundException } from '@nestjs/common';
import { Customer } from '@/customers/models/customer.model';
import { LegalRep } from '@/legalReps/models/legalReps.model';

@Injectable()
export class FindAllCustomerStrategy {
  async find(): Promise<Customer[] | null> {
    return Customer.findAll();
  }
}
