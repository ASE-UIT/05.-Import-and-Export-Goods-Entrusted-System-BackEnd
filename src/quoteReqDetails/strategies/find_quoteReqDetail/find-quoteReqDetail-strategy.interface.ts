import { QuoteReqDetail } from '@/quoteReqDetails/models/quoteReqDetail.model';

export interface IFindQuoteReqDetailStrategy {
    find(quoteReqDetailInfo: string): Promise<QuoteReqDetail[] | null>;
}
