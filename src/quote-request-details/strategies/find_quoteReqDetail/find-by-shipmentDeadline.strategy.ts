import { Injectable } from '@nestjs/common';
import { IFindQuoteReqDetailStrategy } from './find-quoteReqDetail-strategy.interface';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';
import { PackageDetail } from '@/package-details/models/packageDetails.model';
import { InjectModel } from '@nestjs/sequelize';
@Injectable()
export class FindQuoteReqDetailByShipmentDeadlineStrategy implements IFindQuoteReqDetailStrategy {
    constructor(@InjectModel(QuoteReqDetail) private quoteReqDetailModel: typeof QuoteReqDetail) { }

    async find(shipmentDeadline: string): Promise<QuoteReqDetail[] | null> {
        return this.quoteReqDetailModel.findAll({
            where: { shipmentDeadline: shipmentDeadline }
        });
    }
}
