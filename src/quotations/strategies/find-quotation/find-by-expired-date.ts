import { Injectable } from '@nestjs/common';
import { IFindQuotationStrategy } from './find-quotation-strategy.interface';
import { Quotation } from '@/quotations/models/quotations.model';

@Injectable()
export class FindQuotationByExpiredDate implements IFindQuotationStrategy {
  find(quotationExpiredDate: Date): Promise<Quotation[] | null> {
    return Quotation.findAll({
      where: { expiredDate: quotationExpiredDate },
    });
  }
}
