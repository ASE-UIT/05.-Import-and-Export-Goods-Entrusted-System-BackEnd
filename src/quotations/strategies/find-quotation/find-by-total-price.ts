import { Injectable } from '@nestjs/common';
import { IFindQuotationStrategy } from './find-quotation-strategy.interface';
import { Quotation } from '@/quotations/models/quotations.model';

@Injectable()
export class FindQuotationByTotalPrice implements IFindQuotationStrategy {
  find(quotationTotalPrice: number): Promise<Quotation[] | null> {
    return Quotation.findAll({
      where: { totalPrice: quotationTotalPrice },
    });
  }
}
