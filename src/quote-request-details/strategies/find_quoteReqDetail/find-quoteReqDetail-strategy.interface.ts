import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';

export interface IFindQuoteReqDetailStrategy {
    find(quoteReqDetailInfo: string): Promise<QuoteReqDetail[] | null>;
}
