import { Injectable } from '@nestjs/common';
import { IFindQuotationStrategy } from './find-quotation-strategy.interface';
import { Quotation } from '@/quotations/models/quotations.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class FindQuotationByPickupDate implements IFindQuotationStrategy {
  constructor(@InjectModel(Quotation) private quotationModel: typeof Quotation) { }

  find(quotationPickupDate: Date): Promise<Quotation[] | null> {
    return this.quotationModel.findAll({
      where: { pickupDate: quotationPickupDate },
    });
  }
}
