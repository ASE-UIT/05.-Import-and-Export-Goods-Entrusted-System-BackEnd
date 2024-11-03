import { Injectable } from '@nestjs/common';
import { IFindQuoteReqDetailStrategy } from './find-quoteReqDetail-strategy.interface';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';
import { PackageDetail } from '@/package-details/models/packageDetails.model';
@Injectable()
export class FindQuoteReqDetailByQuoteReqIdStrategy implements IFindQuoteReqDetailStrategy {
    async find(quoteReqId: string): Promise<QuoteReqDetail[] | null> {
        return QuoteReqDetail.findAll({
            where: { quoteReqId: quoteReqId }
        });
    }
}
