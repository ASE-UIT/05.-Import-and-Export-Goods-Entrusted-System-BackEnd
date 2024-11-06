import { Injectable } from '@nestjs/common';
import { IFindQuotationStrategy } from './find-quotation-strategy.interface';
import { Quotation } from '@/quotations/models/quotations.model';

@Injectable()
export class FindQuotationByPickupDate implements IFindQuotationStrategy {
  find(quotationPickupDate: Date): Promise<Quotation[] | null> {
    return Quotation.findAll({
      where: { pickupDate: quotationPickupDate },
    });
  }
}
