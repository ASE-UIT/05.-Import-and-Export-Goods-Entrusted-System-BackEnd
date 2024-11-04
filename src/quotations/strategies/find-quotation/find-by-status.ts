import { Injectable } from '@nestjs/common';
import { IFindQuotationStrategy } from './find-quotation-strategy.interface';
import { Quotation } from '@/quotations/models/quotations.model';
import { QuotationStatus } from '@/shared/enums/quotation-status.enum';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FindQuotationByStatus implements IFindQuotationStrategy {
  constructor(@InjectModel(Quotation) private quotationModel: typeof Quotation) { }

  find(quotationStatus: QuotationStatus): Promise<Quotation[] | null> {
    return this.quotationModel.findAll({
      where: { status: quotationStatus },
    });
  }
}
