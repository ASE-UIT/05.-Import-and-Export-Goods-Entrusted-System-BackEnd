import { Injectable } from '@nestjs/common';
import { QuoteReqDetail } from '@/quoteReqDetails/models/quoteReqDetail.model';

@Injectable()
export class FindAllQuoteReqDetailStrategy {
    async find(quoteReqDetailInfo: string): Promise<QuoteReqDetail[] | null> {
        return quoteReqDetailInfo === 'true' && QuoteReqDetail.findAll();
    }
}
