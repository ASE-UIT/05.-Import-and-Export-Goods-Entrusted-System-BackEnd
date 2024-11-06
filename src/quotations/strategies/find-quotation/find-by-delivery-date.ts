import { Injectable } from '@nestjs/common';
import { IFindQuotationStrategy } from './find-quotation-strategy.interface';
import { Quotation } from '@/quotations/models/quotations.model';

@Injectable()
export class FindQuotationByDeliveryDate implements IFindQuotationStrategy {
  find(quotationDeliveryDate: Date): Promise<Quotation[] | null> {
    return Quotation.findAll({
      where: { deliveryDate: quotationDeliveryDate },
    });
  }
}
