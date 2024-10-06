import { Injectable } from '@nestjs/common';
import { IFindCustomerStrategy } from './find-customer-strategy.interface';
import { Customer } from '@/customers/models/customer.model';
import { LegalRep } from '@/legalReps/models/legalReps.model';
import { QuotationReq } from '@/quotationReqs/models/quotationReq.model';

@Injectable()
export class FindCustomerByPhoneStrategy implements IFindCustomerStrategy {
  async find(customerPhone: string): Promise<Customer[] | null> {
    return Customer.findAll({
      where: { phone: customerPhone },
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
