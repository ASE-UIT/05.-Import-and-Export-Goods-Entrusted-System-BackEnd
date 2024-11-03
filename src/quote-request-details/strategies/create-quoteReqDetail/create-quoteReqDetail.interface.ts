import { CreateQuoteReqDetailDto } from '@/quote-request-details/dtos/CreateQuoteReqDetailDto';
import { QuoteReqDetail } from '@/quote-request-details/models/quoteReqDetail.model';

export interface ICreateQuoteReqDetailStrategy {
    create(quoteReqDetailInfo: CreateQuoteReqDetailDto): Promise<QuoteReqDetail>;
}
