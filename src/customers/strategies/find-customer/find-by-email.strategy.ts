import { Injectable } from '@nestjs/common';
import { IFindCustomerStrategy } from './find-customer-strategy.interface';
import { Customer } from '@/customers/models/customer.model';
import { LegalRep } from '@/legalReps/models/legalReps.model';
import { QuotationReq } from '@/quotationReqs/models/quotationReq.model';

@Injectable()
export class FindCustomerByEmailStrategy implements IFindCustomerStrategy {
  async find(customerEmail: string): Promise<Customer[] | null> {
    return Customer.findAll({
      where: { email: customerEmail },
      include: [
        {
          model: LegalRep,
          attributes: ['name', 'phone', 'email'],
        },
        { model: QuotationReq },
      ],
    });
  }
}
