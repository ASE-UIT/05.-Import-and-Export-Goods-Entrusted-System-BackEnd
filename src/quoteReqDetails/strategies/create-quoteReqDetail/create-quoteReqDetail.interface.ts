import { CreateQuoteReqDetailDto } from '@/quoteReqDetails/dtos/CreateQuoteReqDetailDto';

export interface ICreateQuoteReqDetailStrategy {
    create(quoteReqDetailInfo: CreateQuoteReqDetailDto): Promise<void>;
}
