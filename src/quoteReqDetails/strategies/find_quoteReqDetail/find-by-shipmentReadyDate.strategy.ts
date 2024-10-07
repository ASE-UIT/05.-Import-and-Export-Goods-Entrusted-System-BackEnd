import { Injectable } from '@nestjs/common';
import { IFindQuoteReqDetailStrategy } from './find-quoteReqDetail-strategy.interface';
import { QuoteReqDetail } from '@/quoteReqDetails/models/quoteReqDetail.model';
import { PackageDetail } from '@/packageDetails/models/packageDetails.model';

@Injectable()
export class FindQuoteReqDetailByShipmentReadyDateStrategy implements IFindQuoteReqDetailStrategy {
    async find(shipmentReadyDate: string): Promise<QuoteReqDetail[] | null> {
        return QuoteReqDetail.findAll({
            where: { shipmentReadyDate: shipmentReadyDate },
            include: PackageDetail
        });
    }
}
