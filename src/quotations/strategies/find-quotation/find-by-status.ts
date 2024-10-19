import { Injectable } from '@nestjs/common';
import { IFindQuotationStrategy } from './find-quotation-strategy.interface';
import { Quotation } from '@/quotations/models/quotations.model';
import { QuotationStatus } from '@/shared/enums/quotation-status.enum';

@Injectable()
export class FindQuotationByStatus implements IFindQuotationStrategy {
  find(quotationStatus: QuotationStatus): Promise<Quotation[] | null> {
    return Quotation.findAll({
      where: { status: quotationStatus },
    });
  }
}
