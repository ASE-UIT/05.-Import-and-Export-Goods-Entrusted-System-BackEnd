import { Injectable, NotFoundException } from '@nestjs/common';
import { IFindCustomerStrategy } from './find-customer-strategy.interface';
import { Customer } from '@/customers/models/customer.model';
import { QueryCustomerDto } from '@/customers/dtos/QueryCustomerDto';
import { Not } from 'sequelize-typescript';
import { LegalRep } from '@/legalReps/models/legalReps.model';
import { QuotationReq } from '@/quotationReqs/models/quotationReq.model';

@Injectable()
export class FindAllCustomerStrategy {
  async find(): Promise<Customer[] | null> {
    return Customer.findAll({
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
