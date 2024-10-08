import { Injectable } from '@nestjs/common';
import { IFindQuoteReqDetailStrategy } from './find-quoteReqDetail-strategy.interface';
import { QuoteReqDetail } from '@/quoteReqDetails/models/quoteReqDetail.model';
import { PackageDetail } from '@/packageDetails/models/packageDetails.model';

@Injectable()
export class FindQuoteReqDetailByCargoInsuranceStrategy implements IFindQuoteReqDetailStrategy {
    async find(cargoInsurance: string): Promise<QuoteReqDetail[] | null> {
        return QuoteReqDetail.findAll({
            where: { cargoInsurance: cargoInsurance },
            include: PackageDetail
        });
    }
}
