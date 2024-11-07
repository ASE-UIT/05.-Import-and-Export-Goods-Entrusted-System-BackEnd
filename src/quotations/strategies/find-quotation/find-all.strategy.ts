import { Quotation } from '@/quotations/models/quotations.model';
import { Injectable } from '@nestjs/common';
import { IFindQuotationStrategy } from './find-quotation-strategy.interface';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FindAllQuotationStrategy implements IFindQuotationStrategy {
  constructor(@InjectModel(Quotation) private quotationModel: typeof Quotation) { }

  async find(): Promise<Quotation[] | null> {
    return await this.quotationModel.findAll();
  }
}
