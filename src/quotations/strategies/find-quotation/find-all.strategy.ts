import { Quotation } from '@/quotations/models/quotations.model';
import { Injectable } from '@nestjs/common';
import { IFindQuotationStrategy } from './find-quotation-strategy.interface';

@Injectable()
export class FindAllQuotationStrategy implements IFindQuotationStrategy {
  async find(): Promise<Quotation[] | null> {
    return Quotation.findAll();
  }
}
