import { Injectable } from '@nestjs/common';
import { IFindQuotationStrategy } from './find-quotation-strategy.interface';
import { Quotation } from '@/quotations/models/quotations.model';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class FindQuotationByQuotationDate implements IFindQuotationStrategy {
  constructor(@InjectModel(Quotation) private quotationModel: typeof Quotation) { }

  async find(quotationDate: string): Promise<Quotation[] | null> {
    const result = await this.quotationModel.findAll({
      //where: { quotationDate: quotationDate }
      where: Sequelize.where(Sequelize.fn('DATE', Sequelize.col('quotationDate')), quotationDate)
    });
    return result;
  }
}
