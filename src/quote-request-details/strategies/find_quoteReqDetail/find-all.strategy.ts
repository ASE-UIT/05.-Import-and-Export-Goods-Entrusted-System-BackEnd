import { Injectable } from '@nestjs/common';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';
import { PackageDetail } from '@/package-details/models/packageDetails.model';
@Injectable()
export class FindAllQuoteReqDetailStrategy {
    async find(): Promise<QuoteReqDetail[] | null> {
        return QuoteReqDetail.findAll();
    }
}
