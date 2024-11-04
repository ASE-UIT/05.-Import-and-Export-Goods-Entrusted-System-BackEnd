import { Injectable } from '@nestjs/common';
import { IFindQuotationStrategy } from './find-quotation-strategy.interface';
import { Quotation } from '@/quotations/models/quotations.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FindQuotationByQuotationDate implements IFindQuotationStrategy {
  constructor(@InjectModel(Quotation) private quotationModel: typeof Quotation) { }

  async find(quotationQuotationDate: string): Promise<Quotation[] | null> {
    return await this.quotationModel.findAll({
      where: { quotationDate: quotationQuotationDate }
    });
  }
}
