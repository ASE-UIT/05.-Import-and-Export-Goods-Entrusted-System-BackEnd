import { Injectable } from '@nestjs/common';
import { IFindQuoteReqDetailStrategy } from './find-quoteReqDetail-strategy.interface';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';
import { PackageDetail } from '@/package-details/models/packageDetails.model';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class FindQuoteReqDetailByShipmentReadyDateStrategy implements IFindQuoteReqDetailStrategy {
    constructor(@InjectModel(QuoteReqDetail) private quoteReqDetailModel: typeof QuoteReqDetail) { }

    async find(shipmentReadyDate: string): Promise<QuoteReqDetail[] | null> {
        return this.quoteReqDetailModel.findAll({
            //where: { shipmentReadyDate: shipmentReadyDate }
            where: Sequelize.where(Sequelize.fn('DATE', Sequelize.col('shipmentReadyDate')), shipmentReadyDate)
        });
    }
}
