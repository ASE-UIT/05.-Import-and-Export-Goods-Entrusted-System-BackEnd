import { Injectable } from '@nestjs/common';
import { IFindQuotationStrategy } from './find-quotation-strategy.interface';
import { Quotation } from '@/quotations/models/quotations.model';

@Injectable()
export class FindQuotationByQuotationDate implements IFindQuotationStrategy {
  find(quotationQuotationDate: Date): Promise<Quotation[] | null> {
    return Quotation.findAll({
      where: { quotationDate: quotationQuotationDate },
    });
  }
}
