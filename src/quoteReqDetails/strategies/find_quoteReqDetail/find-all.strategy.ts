import { Injectable } from '@nestjs/common';
import { QuoteReqDetail } from '@/quoteReqDetails/models/quoteReqDetail.model';
import { PackageDetail } from '@/packageDetails/models/packageDetails.model';

@Injectable()
export class FindAllQuoteReqDetailStrategy {
    async find(): Promise<QuoteReqDetail[] | null> {
        return QuoteReqDetail.findAll();
    }
}
