import { CreateQuoteReqDetailDto } from '@/quoteReqDetails/dtos/CreateQuoteReqDetailDto';
import { QuoteReqDetail } from '@/quoteReqDetails/models/quoteReqDetail.model';

export interface ICreateQuoteReqDetailStrategy {
    create(quoteReqDetailInfo: CreateQuoteReqDetailDto): Promise<QuoteReqDetail>;
}
